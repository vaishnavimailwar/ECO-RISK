"""add ECO-RISK assessment persistence tables

Revision ID: 0002
Revises: 0001
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "assessment_projects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_name", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "assessment_sites",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("assessment_projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_label", sa.String(length=50), nullable=False),
        sa.Column("location_name", sa.String(length=300), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_assessment_sites_project_id", "assessment_sites", ["project_id"])
    op.create_table(
        "environmental_inventories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("assessment_projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.Integer(), sa.ForeignKey("assessment_sites.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("inventory_data", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_environmental_inventories_project_id", "environmental_inventories", ["project_id"])
    op.create_index("ix_environmental_inventories_site_id", "environmental_inventories", ["site_id"])
    op.create_table(
        "methodology_assessments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("assessment_projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.Integer(), sa.ForeignKey("assessment_sites.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("checklist_data", sa.JSON(), nullable=False),
        sa.Column("impact_matrix_data", sa.JSON(), nullable=False),
        sa.Column("ad_hoc_observations", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_methodology_assessments_project_id", "methodology_assessments", ["project_id"])
    op.create_index("ix_methodology_assessments_site_id", "methodology_assessments", ["site_id"])
    op.create_table(
        "mcda_results",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("assessment_projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("site_id", sa.Integer(), sa.ForeignKey("assessment_sites.id", ondelete="CASCADE"), nullable=False),
        sa.Column("overall_score", sa.Float(), nullable=True),
        sa.Column("rank", sa.Integer(), nullable=True),
        sa.Column("category_scores", sa.JSON(), nullable=False),
        sa.Column("calculation_metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_mcda_results_project_id", "mcda_results", ["project_id"])
    op.create_index("ix_mcda_results_site_id", "mcda_results", ["site_id"])
    op.create_table(
        "decision_support_results",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("assessment_projects.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("recommended_site_id", sa.Integer(), sa.ForeignKey("assessment_sites.id", ondelete="SET NULL"), nullable=True),
        sa.Column("recommended_site_label", sa.String(length=50), nullable=True),
        sa.Column("overall_score", sa.Float(), nullable=True),
        sa.Column("decision_data", sa.JSON(), nullable=False),
        sa.Column("confidence_status", sa.String(length=50), nullable=True),
        sa.Column("assessment_completeness", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_decision_support_results_project_id", "decision_support_results", ["project_id"])


def downgrade() -> None:
    op.drop_table("decision_support_results")
    op.drop_index("ix_mcda_results_site_id", table_name="mcda_results")
    op.drop_index("ix_mcda_results_project_id", table_name="mcda_results")
    op.drop_table("mcda_results")
    op.drop_index("ix_methodology_assessments_site_id", table_name="methodology_assessments")
    op.drop_index("ix_methodology_assessments_project_id", table_name="methodology_assessments")
    op.drop_table("methodology_assessments")
    op.drop_index("ix_environmental_inventories_site_id", table_name="environmental_inventories")
    op.drop_index("ix_environmental_inventories_project_id", table_name="environmental_inventories")
    op.drop_table("environmental_inventories")
    op.drop_index("ix_assessment_sites_project_id", table_name="assessment_sites")
    op.drop_table("assessment_sites")
    op.drop_table("assessment_projects")
