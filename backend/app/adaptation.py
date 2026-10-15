"""Private per-student/topic Bernoulli bandit; never updates language-model weights."""

import random

from sqlalchemy import select

from .database import LearnerMemory, TeachingArm

STYLES = {
    "step_by_step": "Explain one small step at a time and check understanding with one question.",
    "worked_example": "Use one short worked example supported by the supplied evidence, then ask one guiding question.",
    "short_explanation": "Give a concise explanation using the supplied evidence, then ask one guiding question.",
}


def memory_enabled(db, user_id):
    memory = db.get(LearnerMemory, user_id)
    return bool(memory and memory.enabled)


def choose_style(db, user_id, topic_id, detailed=False, rng=None):
    if not memory_enabled(db, user_id):
        return None
    arms = {
        row.style: row
        for row in db.scalars(
            select(TeachingArm).where(
                TeachingArm.user_id == user_id, TeachingArm.topic_id == topic_id
            )
        )
    }
    allowed = [style for style in STYLES if not detailed or style != "short_explanation"]
    if not any(row.helpful + row.unhelpful for row in arms.values()):
        return "step_by_step"
    sampler = rng or random.SystemRandom()
    return max(
        allowed,
        key=lambda style: sampler.betavariate(
            1 + (arms[style].helpful if style in arms else 0),
            1 + (arms[style].unhelpful if style in arms else 0),
        ),
    )
