"""Original synthetic arithmetic/style experiment. No students or benchmark items."""

import json
from pathlib import Path


def examples(groups, split):
    rows = []
    for group in groups:
        for number in [2, 4, 6, 8]:
            if group == "addition":
                fact, question = f"{number} + 3 = {number + 3}.", f"Help me add {number} and 3."
            elif group == "subtraction":
                fact, question = (
                    f"{number + 7} - 7 = {number}.",
                    f"Help me subtract 7 from {number + 7}.",
                )
            elif group == "multiplication":
                fact, question = (
                    f"{number} times 3 = {number * 3}.",
                    f"Help me calculate {number} times 3.",
                )
            elif group == "division":
                fact, question = (
                    f"{number * 4} divided by 4 = {number}.",
                    f"Help me divide {number * 4} by 4.",
                )
            elif group == "square-area":
                fact, question = (
                    f"Area of a square = side times side. For side {number} cm, area = {number * number} square cm.",
                    f"Explain the area of a square with side {number} cm.",
                )
            elif group == "rectangle-perimeter":
                fact, question = (
                    f"Perimeter of a rectangle = 2 times (length + width). With length {number} cm and width 3 cm, perimeter = {2 * (number + 3)} cm.",
                    f"Explain the perimeter for a rectangle of length {number} cm and width 3 cm.",
                )
            elif group == "double":
                fact, question = (
                    f"Double means multiply by 2. Double of {number} is {2 * number}.",
                    f"How can I double {number}?",
                )
            else:
                fact, question = (
                    f"Half means divide by 2. Half of {2 * number} is {number}.",
                    f"How can I find half of {2 * number}?",
                )
            for language in ["en", "hi", "hinglish"]:
                source_id = f"original-{group}-{number}:0"
                hindi_fact = fact.replace(" times ", " गुणा ").replace(" divided by ", " भाग ")
                if group == "square-area":
                    hindi_fact = f"वर्ग का क्षेत्रफल = भुजा × भुजा। {number} सेमी भुजा का क्षेत्रफल {number * number} वर्ग सेमी है।"
                elif group == "rectangle-perimeter":
                    hindi_fact = f"आयत का परिमाप = 2 × (लंबाई + चौड़ाई)। {number} सेमी और 3 सेमी के लिए परिमाप {2 * (number + 3)} सेमी है।"
                elif group == "double":
                    hindi_fact = f"दोगुना करने के लिए 2 से गुणा करें। {number} का दोगुना {2 * number} है।"
                elif group == "half":
                    hindi_fact = f"आधा करने के लिए 2 से भाग दें। {2 * number} का आधा {number} है।"
                reply = {
                    "en": f"Let's use one small step. {fact} Which operation helps us here?",
                    "hi": f"इसे एक छोटे चरण में समझें। गणना है: {hindi_fact} यहाँ कौन-सी गणितीय क्रिया काम आती है?",
                    "hinglish": f"Chalo ek chhote step se samjhte hain. {fact} Yahan kaunsi operation kaam aati hai?",
                }[language]
                rows.append(
                    {
                        "id": f"behavior-{split}-{group}-{number}-{language}",
                        "split_group": f"behavior-{group}",
                        "source_id": source_id,
                        "license": "Original ScortIQ synthetic examples, CC0-1.0",
                        "reviewer": "",
                        "reviewed": False,
                        "messages": [
                            {
                                "role": "system",
                                "content": f"You are a helpful tutor. Use only the evidence below. Teach in {language}. Ask exactly one guiding question. Return only JSON with reply and citations. Evidence: {json.dumps({'id': source_id, 'text': fact})}",
                            },
                            {"role": "user", "content": question},
                            {
                                "role": "assistant",
                                "content": json.dumps(
                                    {"reply": reply, "citations": [source_id]}, ensure_ascii=False
                                ),
                            },
                        ],
                    }
                )
    return rows


def main():
    output = Path("ml/data/behavior-experiment-v1")
    output.mkdir(parents=True, exist_ok=True)
    for split, groups in [
        (
            "train",
            [
                "addition",
                "subtraction",
                "multiplication",
                "division",
                "square-area",
                "rectangle-perimeter",
            ],
        ),
        ("validation", ["double", "half"]),
    ]:
        data = examples(groups, split)
        (output / f"{split}.jsonl").write_text(
            "".join(json.dumps(row, ensure_ascii=False) + "\n" for row in data), encoding="utf-8"
        )
        print(f"{split}: {len(data)} unreviewed synthetic examples")


if __name__ == "__main__":
    main()
