import json

from studybuddy_backend import create_app


def _write_sample_data(path):
    data = [
        {
            "name": "Test Building",
            "code": "TST",
            "coordinates": [-71.0, 42.0],
            "rooms": [
                {
                    "roomNumber": "101",
                    "schedule": [
                        {
                            "Slots": [
                                {"StartTime": "09:00:00", "EndTime": "17:00:00"}
                            ]
                        }
                    ],
                }
            ],
        }
    ]
    path.write_text(json.dumps(data))


def test_open_classrooms_rejects_bad_payload(tmp_path):
    data_path = tmp_path / "data.json"
    _write_sample_data(data_path)

    app = create_app()
    app.config["DATA_PATH"] = str(data_path)
    client = app.test_client()

    response = client.post("/api/open-classrooms", json={"lat": "x", "lng": 0})
    assert response.status_code == 400


def test_open_classrooms_returns_buildings(tmp_path):
    data_path = tmp_path / "data.json"
    _write_sample_data(data_path)

    app = create_app()
    app.config["DATA_PATH"] = str(data_path)
    client = app.test_client()

    response = client.get("/api/open-classrooms")
    assert response.status_code == 200
    payload = response.get_json()
    assert isinstance(payload, list)
    assert payload[0]["building_code"] == "TST"


def test_health_endpoint():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/health")
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["status"] == "ok"
