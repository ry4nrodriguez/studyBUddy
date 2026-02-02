from datetime import datetime

from studybuddy_backend.services.availability import get_slot_status


def test_get_slot_status_available():
    current_time = datetime.strptime("10:00:00", "%H:%M:%S").time()
    assert get_slot_status(current_time, "09:00:00", "17:00:00") == "available"


def test_get_slot_status_upcoming():
    current_time = datetime.strptime("08:50:00", "%H:%M:%S").time()
    assert get_slot_status(current_time, "09:00:00", "17:00:00") == "upcoming"


def test_get_slot_status_spans_midnight():
    current_time = datetime.strptime("23:30:00", "%H:%M:%S").time()
    assert get_slot_status(current_time, "22:00:00", "02:00:00") == "available"
