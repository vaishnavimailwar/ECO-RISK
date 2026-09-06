from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AssessmentProject, AssessmentSite, EnvironmentalInventory, MethodologyAssessment, MCDAResult, DecisionSupportResult
from app.schemas import (
    AssessmentProjectCreate, AssessmentProjectDetail, AssessmentProjectResponse, AssessmentProjectUpdate,
    AssessmentSiteCreate, AssessmentSiteResponse, AssessmentSiteUpdate, DecisionSupportPayload,
    InventoryPayload, MCDAResultsPayload, MethodologyPayload,
)

router = APIRouter(prefix="/api/assessments", tags=["ECO-RISK Assessments"])


def get_project_or_404(db: Session, project_id: int) -> AssessmentProject:
    project = db.query(AssessmentProject).filter(AssessmentProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Assessment project not found")
    return project


def get_site_or_404(db: Session, site_id: int) -> AssessmentSite:
    site = db.query(AssessmentSite).filter(AssessmentSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Assessment site not found")
    return site


@router.post("/projects", response_model=AssessmentProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(payload: AssessmentProjectCreate, db: Session = Depends(get_db)):
    project = AssessmentProject(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/projects", response_model=List[AssessmentProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return db.query(AssessmentProject).order_by(AssessmentProject.updated_at.desc()).all()


@router.get("/projects/{project_id}", response_model=AssessmentProjectDetail)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = get_project_or_404(db, project_id)
    return {**project.__dict__, "sites": db.query(AssessmentSite).filter(AssessmentSite.project_id == project_id).all()}


@router.put("/projects/{project_id}", response_model=AssessmentProjectResponse)
def update_project(project_id: int, payload: AssessmentProjectUpdate, db: Session = Depends(get_db)):
    project = get_project_or_404(db, project_id)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, key, value)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = get_project_or_404(db, project_id)
    db.delete(project)
    db.commit()


@router.post("/projects/{project_id}/sites", response_model=AssessmentSiteResponse, status_code=status.HTTP_201_CREATED)
def create_site(project_id: int, payload: AssessmentSiteCreate, db: Session = Depends(get_db)):
    get_project_or_404(db, project_id)
    site = AssessmentSite(project_id=project_id, **payload.model_dump())
    db.add(site)
    db.commit()
    db.refresh(site)
    return site


@router.get("/projects/{project_id}/sites", response_model=List[AssessmentSiteResponse])
def list_sites(project_id: int, db: Session = Depends(get_db)):
    get_project_or_404(db, project_id)
    return db.query(AssessmentSite).filter(AssessmentSite.project_id == project_id).order_by(AssessmentSite.id).all()


@router.put("/sites/{site_id}", response_model=AssessmentSiteResponse)
def update_site(site_id: int, payload: AssessmentSiteUpdate, db: Session = Depends(get_db)):
    site = get_site_or_404(db, site_id)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(site, key, value)
    db.commit()
    db.refresh(site)
    return site


@router.delete("/sites/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site(site_id: int, db: Session = Depends(get_db)):
    site = get_site_or_404(db, site_id)
    db.delete(site)
    db.commit()


@router.put("/sites/{site_id}/inventory")
def save_inventory(site_id: int, payload: InventoryPayload, db: Session = Depends(get_db)):
    site = get_site_or_404(db, site_id)
    record = db.query(EnvironmentalInventory).filter(EnvironmentalInventory.site_id == site_id).first()
    if not record:
        record = EnvironmentalInventory(project_id=site.project_id, site_id=site_id)
        db.add(record)
    record.inventory_data = payload.inventory_data
    db.commit()
    db.refresh(record)
    return record


@router.get("/sites/{site_id}/inventory")
def get_inventory(site_id: int, db: Session = Depends(get_db)):
    get_site_or_404(db, site_id)
    record = db.query(EnvironmentalInventory).filter(EnvironmentalInventory.site_id == site_id).first()
    return record or {"site_id": site_id, "inventory_data": {}}


@router.put("/sites/{site_id}/methodology")
def save_methodology(site_id: int, payload: MethodologyPayload, db: Session = Depends(get_db)):
    site = get_site_or_404(db, site_id)
    record = db.query(MethodologyAssessment).filter(MethodologyAssessment.site_id == site_id).first()
    if not record:
        record = MethodologyAssessment(project_id=site.project_id, site_id=site_id)
        db.add(record)
    for key, value in payload.model_dump().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record


@router.get("/sites/{site_id}/methodology")
def get_methodology(site_id: int, db: Session = Depends(get_db)):
    get_site_or_404(db, site_id)
    record = db.query(MethodologyAssessment).filter(MethodologyAssessment.site_id == site_id).first()
    return record or {"site_id": site_id, "checklist_data": {}, "impact_matrix_data": {}, "ad_hoc_observations": []}


@router.put("/projects/{project_id}/mcda")
def save_mcda(project_id: int, payload: MCDAResultsPayload, db: Session = Depends(get_db)):
    get_project_or_404(db, project_id)
    for result in payload.results:
        site = db.query(AssessmentSite).filter(AssessmentSite.id == result.site_id, AssessmentSite.project_id == project_id).first()
        if not site:
            raise HTTPException(status_code=400, detail=f"Site {result.site_id} does not belong to project {project_id}")
        record = db.query(MCDAResult).filter(MCDAResult.project_id == project_id, MCDAResult.site_id == result.site_id).first()
        if not record:
            record = MCDAResult(project_id=project_id, site_id=result.site_id)
            db.add(record)
        for key, value in result.model_dump().items():
            if key != "site_id": setattr(record, key, value)
    db.commit()
    return {"saved": len(payload.results)}


@router.get("/projects/{project_id}/mcda")
def get_mcda(project_id: int, db: Session = Depends(get_db)):
    get_project_or_404(db, project_id)
    return db.query(MCDAResult).filter(MCDAResult.project_id == project_id).order_by(MCDAResult.rank).all()


@router.put("/projects/{project_id}/decision")
def save_decision(project_id: int, payload: DecisionSupportPayload, db: Session = Depends(get_db)):
    get_project_or_404(db, project_id)
    record = db.query(DecisionSupportResult).filter(DecisionSupportResult.project_id == project_id).first()
    if not record:
        record = DecisionSupportResult(project_id=project_id)
        db.add(record)
    for key, value in payload.model_dump().items(): setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record


@router.get("/projects/{project_id}/decision")
def get_decision(project_id: int, db: Session = Depends(get_db)):
    get_project_or_404(db, project_id)
    record = db.query(DecisionSupportResult).filter(DecisionSupportResult.project_id == project_id).first()
    return record or {"project_id": project_id, "decision_data": {}}