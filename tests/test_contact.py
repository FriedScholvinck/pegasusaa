import json
import unittest
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ContactFormParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.form = None
        self.fields = {}
        self.current_label = None
        self.labels = {}

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "form" and attributes.get("data-formspree-key") == "contact":
            self.form = attributes
        if tag in {"input", "textarea"} and "name" in attributes:
            self.fields[attributes["name"]] = attributes
        if tag == "label" and "for" in attributes:
            self.current_label = attributes["for"]

    def handle_data(self, data):
        if self.current_label and data.strip():
            self.labels[self.current_label] = data.strip()

    def handle_endtag(self, tag):
        if tag == "label":
            self.current_label = None


class ContactPageTests(unittest.TestCase):
    def setUp(self):
        parser = ContactFormParser()
        parser.feed((ROOT / "contact.html").read_text(encoding="utf-8"))
        self.parser = parser

    def test_form_posts_to_formspree_contact_endpoint(self):
        self.assertIsNotNone(self.parser.form)
        self.assertEqual("post", self.parser.form["method"].lower())
        self.assertRegex(
            self.parser.form["action"],
            r"^https://formspree\.io/p/[0-9]+/f/contact$",
        )

    def test_contact_fields_are_required_and_accessibly_labelled(self):
        for name in ("name", "email", "message"):
            with self.subTest(name=name):
                field = self.parser.fields[name]
                self.assertIn("required", field)
                self.assertIn(field["id"], self.parser.labels)
        self.assertEqual("email", self.parser.fields["email"]["type"])

    def test_formspree_config_validates_fields_and_emails_jim(self):
        config = json.loads((ROOT / "formspree.json").read_text(encoding="utf-8"))
        contact = config["forms"]["contact"]
        self.assertEqual(
            {"type": "email", "to": "jim@pegasusaa.com"},
            contact["actions"][0],
        )
        self.assertEqual(
            {
                "name": {"type": "text", "required": True},
                "email": {"type": "email", "required": True},
                "message": {"type": "text", "required": True},
            },
            contact["fields"],
        )


if __name__ == "__main__":
    unittest.main()
