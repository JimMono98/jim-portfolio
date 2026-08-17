import ContactPageClient from "@/components/contact/ContactPageClient";
import {
  contactDefaults,
  normalizeContactPage,
} from "@/data/contactDefaults";
import { getContactPage } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export default async function Contact() {
  let content = contactDefaults;

  try {
    content = normalizeContactPage(await getContactPage());
  } catch (error) {
    console.error("Unable to load Contact Page content from Sanity.", error);
    content = normalizeContactPage(null);
  }

  return <ContactPageClient content={content} />;
}
