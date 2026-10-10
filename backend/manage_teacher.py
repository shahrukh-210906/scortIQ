"""Operator-only role provisioning. No public API can approve teachers."""

import argparse
import os

from sqlalchemy import select

from .app.database import SessionLocal, Teacher, User


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["list", "grant", "revoke"])
    parser.add_argument("--user-id")
    args = parser.parse_args()
    with SessionLocal() as db:
        if args.action == "list":
            for user in db.scalars(select(User)):
                print(user.id, user.name, "teacher" if db.get(Teacher, user.id) else "student")
            return
        user = db.get(User, args.user_id) if args.user_id else None
        if not user:
            parser.error("Supply an existing account with --user-id.")
        if args.action == "grant":
            if os.getenv("APP_ENV") == "production" and not user.identity.startswith("supabase:"):
                parser.error("Production teachers must have a verified account.")
            if not db.get(Teacher, user.id):
                db.add(Teacher(user_id=user.id))
        else:
            teacher = db.get(Teacher, user.id)
            if teacher:
                db.delete(teacher)
        db.commit()
        print("Role updated. Reload the account to see the change.")


if __name__ == "__main__":
    main()
