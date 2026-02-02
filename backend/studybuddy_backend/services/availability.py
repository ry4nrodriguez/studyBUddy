from datetime import datetime


def get_slot_status(current_time, start_time_str: str, end_time_str: str) -> str:
    start_time = datetime.strptime(start_time_str, "%H:%M:%S").time()
    end_time = datetime.strptime(end_time_str, "%H:%M:%S").time()

    spans_midnight = end_time < start_time
    time_until = datetime.combine(datetime.today(), start_time) - datetime.combine(
        datetime.today(), current_time
    )
    minutes_until = time_until.total_seconds() / 60

    if spans_midnight:
        if start_time <= current_time or current_time <= end_time:
            return "available"
        if 0 < minutes_until < 20:
            return "upcoming"
        return "unavailable"

    if 0 < minutes_until < 20:
        return "upcoming"
    if start_time <= current_time <= end_time:
        return "available"
    if current_time > end_time:
        return "passed"
    return "unavailable"
