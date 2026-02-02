from flask import Blueprint, current_app, jsonify, request
from datetime import datetime

from ..services.availability import get_slot_status
from ..services.data_loader import load_spaces
from ..services.distance import haversine_km

open_classrooms_bp = Blueprint("open_classrooms", __name__)


def _parse_location(payload):
    if payload is None:
        return None, None, ("No data provided", 400)

    user_lat = payload.get("lat")
    user_lng = payload.get("lng")

    if user_lat is None or user_lng is None:
        return None, None, ("Invalid location data. 'lat' and 'lng' are required.", 400)

    try:
        user_lat = float(user_lat)
        user_lng = float(user_lng)
    except (TypeError, ValueError):
        return None, None, ("Invalid location data. 'lat' and 'lng' must be numbers.", 400)

    if not (-90 <= user_lat <= 90) or not (-180 <= user_lng <= 180):
        return None, None, ("Invalid location data. 'lat' or 'lng' out of range.", 400)

    return user_lat, user_lng, None


def _iter_slots(schedule):
    if not isinstance(schedule, list):
        return []

    slots = []
    for entry in schedule:
        if not isinstance(entry, dict):
            continue
        raw_slots = entry.get("Slots") or []
        if not isinstance(raw_slots, list):
            continue
        for slot in raw_slots:
            if not isinstance(slot, dict):
                continue
            start_time = slot.get("StartTime")
            end_time = slot.get("EndTime")
            if start_time and end_time:
                slots.append((start_time, end_time))
    return slots


@open_classrooms_bp.route("/api/open-classrooms", methods=["GET", "POST"])
def get_open_classrooms():
    user_lat = None
    user_lng = None

    if request.method == "POST":
        payload = request.get_json(silent=True)
        user_lat, user_lng, error = _parse_location(payload)
        if error:
            message, status = error
            return jsonify({"error": message}), status

    data_path = current_app.config["DATA_PATH"]
    bu_data = load_spaces(data_path)

    current_time = current_app.config.get("CURRENT_TIME_OVERRIDE") or datetime.now().time()
    building_info_list = []

    for building in bu_data:
        building_name = building.get("name")
        building_code = building.get("code")
        building_coords = building.get("coordinates") or []

        if not building_name or not building_code:
            continue

        rooms = {}
        building_status = "unavailable"

        for room in building.get("rooms", []):
            if not isinstance(room, dict):
                continue
            room_number = room.get("roomNumber")
            schedule = room.get("schedule")

            if not room_number:
                continue

            slots_with_status = []
            for start_time, end_time in _iter_slots(schedule):
                status = get_slot_status(current_time, start_time, end_time)

                if building_status != "available" and status == "available":
                    building_status = "available"
                elif building_status == "unavailable" and status == "upcoming":
                    building_status = "upcoming"

                if status != "passed":
                    slots_with_status.append(
                        {
                            "StartTime": start_time,
                            "EndTime": end_time,
                            "Status": status,
                        }
                    )

            if slots_with_status:
                rooms[room_number] = {"slots": slots_with_status}

        if not rooms:
            continue

        distance = 0
        if (
            user_lat is not None
            and user_lng is not None
            and isinstance(building_coords, list)
            and len(building_coords) == 2
        ):
            distance = haversine_km(
                user_lat, user_lng, building_coords[1], building_coords[0]
            )

        building_info_list.append(
            {
                "building": building_name,
                "building_code": building_code,
                "building_status": building_status,
                "rooms": rooms,
                "coords": building_coords,
                "distance": distance,
            }
        )

    if user_lat is not None and user_lng is not None:
        building_info_list = sorted(building_info_list, key=lambda x: x["distance"])

    return jsonify(building_info_list)
