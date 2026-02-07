import type { IHyperProfileUser } from "../models";

/** Generate vCard (VCF) content from user profile */
export function generateVCard(profile: IHyperProfileUser): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  if (profile.displayName) {
    lines.push("FN:" + profile.displayName);
  }

  if (profile.surname || profile.givenName) {
    const surname = profile.surname || "";
    const givenName = profile.givenName || "";
    lines.push("N:" + surname + ";" + givenName + ";;;");
  }

  if (profile.companyName) {
    lines.push("ORG:" + profile.companyName);
  }

  if (profile.jobTitle) {
    lines.push("TITLE:" + profile.jobTitle);
  }

  if (profile.mail) {
    lines.push("EMAIL;TYPE=INTERNET:" + profile.mail);
  }

  if (profile.mobilePhone) {
    lines.push("TEL;TYPE=CELL:" + profile.mobilePhone);
  }

  if (profile.businessPhones && profile.businessPhones.length > 0) {
    profile.businessPhones.forEach(function (phone) {
      lines.push("TEL;TYPE=WORK:" + phone);
    });
  }

  if (profile.city || profile.officeLocation) {
    const city = profile.city || "";
    const office = profile.officeLocation || "";
    lines.push("ADR;TYPE=WORK:;;" + office + ";" + city + ";;;");
  }

  if (profile.aboutMe) {
    const cleanNote = profile.aboutMe.replace(/\r?\n/g, "\\n");
    lines.push("NOTE:" + cleanNote);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

/** Download vCard file */
export function downloadVCard(profile: IHyperProfileUser): void {
  const vCardContent = generateVCard(profile);
  const blob = new Blob([vCardContent], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = (profile.displayName || "contact") + ".vcf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
