import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_assessment_persistence_workflow():
    project = client.post("/api/assessments/projects", json={"project_name": "ECO-RISK API Test"})
    assert project.status_code == 201
    project_id = project.json()["id"]

    site = client.post(
        f"/api/assessments/projects/{project_id}/sites",
        json={"site_label": "Site A", "location_name": "Delhi", "latitude": 28.6139, "longitude": 77.2090},
    )
    assert site.status_code == 201
    site_id = site.json()["id"]

    assert client.put(
        f"/api/assessments/sites/{site_id}/inventory",
        json={"inventory_data": {"physical": {"floodSusceptibility": "Moderate"}}},
    ).status_code == 200
    assert client.put(
        f"/api/assessments/sites/{site_id}/methodology",
        json={"checklist_data": {}, "impact_matrix_data": {"physical.siteDevelopment": "Moderate Impact"}, "ad_hoc_observations": []},
    ).status_code == 200
    assert client.put(
        f"/api/assessments/projects/{project_id}/mcda",
        json={"results": [{"site_id": site_id, "overall_score": 75.5, "rank": 1, "category_scores": {"physical": 75.5}, "calculation_metadata": {}}]},
    ).status_code == 200
    assert client.put(
        f"/api/assessments/projects/{project_id}/decision",
        json={"recommended_site_id": site_id, "recommended_site_label": "Site A", "overall_score": 75.5, "decision_data": {}, "confidence_status": "LIMITED CONFIDENCE", "assessment_completeness": 5},
    ).status_code == 200

    project_detail = client.get(f"/api/assessments/projects/{project_id}")
    assert project_detail.status_code == 200
    assert project_detail.json()["sites"][0]["location_name"] == "Delhi"
    assert client.get(f"/api/assessments/sites/{site_id}/inventory").json()["inventory_data"]["physical"]["floodSusceptibility"] == "Moderate"
    assert client.get(f"/api/assessments/projects/{project_id}/mcda").json()[0]["overall_score"] == 75.5
    assert client.get(f"/api/assessments/projects/{project_id}/decision").json()["recommended_site_label"] == "Site A"

    assert client.delete(f"/api/assessments/projects/{project_id}").status_code == 204