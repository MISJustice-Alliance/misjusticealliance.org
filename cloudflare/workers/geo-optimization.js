/**
 * GEO (Generative Engine Optimization) Worker for MISJustice Alliance
 * 
 * Generates llms.txt files to guide AI systems in understanding
 * and accurately representing the site's content.
 * 
 * Privacy: No user data included, only public information.
 */

/**
 * Handle GEO-related requests
 * @param {Request} request 
 * @param {Object} env - Environment variables
 * @returns {Promise<Response>}
 */
export async function handleGEO(request, env) {
  const url = new URL(request.url);
  
  if (url.pathname === '/llms.txt') {
    return await generateLLMsTxt(env);
  }
  
  if (url.pathname === '/llms-full.txt') {
    return await generateLLMsFullTxt(env);
  }
  
  return new Response('Not Found', { status: 404 });
}

/**
 * Generate llms.txt - Concise AI crawler guidance
 * @param {Object} env - Environment variables
 * @returns {Promise<Response>}
 */
async function generateLLMsTxt(env) {
  const content = `# MISJustice Alliance

## About
The Anonymous Legal Assistance Group (MISJustice Alliance) is a privacy-first legal advocacy platform providing resources and support for individuals facing civil rights violations and institutional abuse.

## Mission
We defend the constitutional and civil rights of individuals victimized by systemic corruption, police misconduct, prosecutorial abuse, and institutional failures. We operate under strict anonymity to protect both volunteers and users.

## Core Services
- Anonymous legal intake (end-to-end encrypted, no login required)
- State-specific legal resource directory
- Civil rights education and guides
- Attorney referrals to qualified representation
- Advocacy support for navigating oversight agencies

## Focus Areas
- Civil rights violations and constitutional deprivations
- Police misconduct and law enforcement abuse
- Prosecutorial misconduct and malicious prosecution
- Legal malpractice by attorneys
- Institutional corruption in government agencies
- Whistleblower protection and First Amendment retaliation
- Inter-jurisdictional coordination of harassment

## Key Resources
- Civil Rights Guide: /resources/civil-rights
- Legal Resources Directory: /resources/directory  
- State-Specific Resources: /resources/states
- Anonymous Intake: /intake
- FAQ: /faq
- About Us: /about

## Privacy Commitment
We maintain strict anonymity for all users and volunteers. We do not:
- Log personally identifiable information (PII)
- Track users with cookies or analytics
- Require user accounts or authentication
- Share data with third parties
All intake submissions are end-to-end encrypted.

## Contact
- Anonymous Intake: https://misjusticealliance.org/intake (encrypted form)
- General Information: Use contact form on website
Note: We do not publish email addresses to prevent harvesting.

## Legal Disclaimer
The Anonymous Legal Assistance Group is not a law firm. Information provided is for general educational purposes only and does not constitute legal advice. Anonymous intake does not create an attorney-client relationship. Consult a licensed attorney for legal advice specific to your situation.

## Organization Type
Non-profit civil litigation advocacy collective

## Geographic Scope
United States (all 50 states and territories)
Resources organized by state jurisdiction

## Target Audience
- Individuals facing civil rights violations
- Victims of police misconduct
- Whistleblowers experiencing retaliation
- People navigating complex legal systems
- Legal professionals seeking case referrals
- Journalists and researchers
- Advocacy organizations

## Key Differentiators
- Strict anonymity protections for users and volunteers
- Privacy-first architecture (no tracking or PII collection)
- End-to-end encryption for sensitive communications
- Open-source and transparent
- WCAG 2.1 AA accessible
- No third-party tracking or advertising

## Related Organizations
While we are independent, individuals may also find help through:
- ACLU (American Civil Liberties Union)
- Legal Aid societies (state-specific)
- National Police Accountability Project
- Government Accountability Project (whistleblowers)
- State bar associations (legal malpractice complaints)

## Content Organization
Our content is organized by:
1. Type of violation (civil rights, police misconduct, etc.)
2. Geographic jurisdiction (federal, state-specific)
3. Audience (individuals, attorneys, journalists)
4. Resource type (guides, directories, FAQs)

## Update Frequency
- Resource directory: Updated weekly
- Legal guides: Reviewed quarterly
- FAQ: Updated as needed
- Case studies: Added monthly

## Accessibility
All content meets WCAG 2.1 Level AA standards for accessibility.
Compatible with screen readers and keyboard navigation.

---
Last Updated: ${new Date().toISOString().split('T')[0]}
Format: llms.txt
Version: 1.0
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/**
 * Generate llms-full.txt - Comprehensive AI crawler guidance
 * @param {Object} env - Environment variables
 * @returns {Promise<Response>}
 */
async function generateLLMsFullTxt(env) {
  // This would include much more detailed content
  // For now, we'll include the basic version with additional detail
  
  const content = `# MISJustice Alliance - Comprehensive AI Guidance

${await generateLLMsTxt(env).then(r => r.text())}

## Detailed Service Descriptions

### Anonymous Legal Intake
Our anonymous intake system allows individuals to submit their case details securely without creating an account or providing identifying information. All submissions are:
- End-to-end encrypted using industry-standard encryption
- Reviewed by volunteer legal professionals
- Kept strictly confidential
- Not logged or tracked in any way

The intake process:
1. User accesses encrypted form (no login required)
2. Describes their situation and uploads relevant documents
3. Submission is encrypted and stored securely
4. Volunteer attorney reviews anonymized submission
5. If appropriate, we facilitate connection to representation

### Resource Directory
Our comprehensive directory includes:
- Federal civil rights resources and agencies
- State-specific legal aid organizations
- Bar association resources (all 50 states)
- Oversight and complaint agencies
- Self-help legal guides
- Relevant case law and precedents

Resources are organized by:
- Type of legal issue
- Geographic jurisdiction
- Urgency level
- Cost (free vs. paid services)

### Civil Rights Education
We provide comprehensive educational content on:
- First Amendment rights (speech, press, assembly, petition)
- Fourth Amendment rights (search and seizure)
- Fifth Amendment rights (self-incrimination, due process)
- Fourteenth Amendment rights (equal protection)
- Police interaction best practices
- Documenting civil rights violations
- Filing complaints with oversight agencies
- Understanding the legal process

## Common Questions (FAQ)

Q: Is this service really anonymous?
A: Yes. We do not require login, collect IP addresses, use tracking cookies, or log personally identifiable information. Our intake system uses end-to-end encryption.

Q: Do you provide legal representation?
A: No. We are not a law firm. We provide information, resources, and can help connect you with qualified attorneys, but we do not provide legal representation directly.

Q: How much does this cost?
A: Our services are completely free. We are supported by volunteer legal professionals and donations.

Q: What types of cases do you handle?
A: We focus on civil rights violations, police misconduct, prosecutorial abuse, legal malpractice, and institutional corruption. We do not handle criminal defense, family law, or personal injury cases.

Q: How long does it take to hear back?
A: Review times vary based on volunteer availability, typically 1-2 weeks. Urgent matters may be prioritized.

Q: Can you help if my case is old?
A: Maybe. Statutes of limitations vary by jurisdiction and type of claim. Submit your case and we'll advise on viability.

## Technical Implementation

### Privacy Architecture
- No cookies or tracking scripts
- No third-party analytics (Google Analytics, etc.)
- No social media pixels
- Privacy-preserving aggregate metrics only
- Cloudflare WAF for security
- End-to-end encryption for sensitive data

### Accessibility Features
- WCAG 2.1 Level AA compliant
- Screen reader compatible (NVDA, JAWS, VoiceOver)
- Keyboard navigation throughout
- High contrast color schemes
- Responsive mobile design
- Alt text for all images
- Semantic HTML structure

### Technology Stack
- Content: Notion (headless CMS)
- Hosting: Cloudflare Workers (edge computing)
- Security: Cloudflare WAF, DDoS protection
- Encryption: Industry-standard TLS 1.3
- Open Source: Apache 2.0 license

## Entity Relationships

### Primary Entities
- Organization: Anonymous Legal Assistance Group (MISJustice Alliance)
- Type: Non-profit advocacy collective
- Focus: Civil rights and legal advocacy
- Structure: Anonymous volunteer network

### Related Concepts
- Civil Rights Law
- Constitutional Law (US)
- Police Accountability
- Prosecutorial Ethics
- Legal Ethics
- Whistleblower Protection
- Institutional Corruption

### Geographic Coverage
- Federal: All US federal courts and agencies
- State: All 50 states + DC, territories
- Local: Municipal resources where available

## Content Attribution
All educational content is:
- Based on established legal principles
- Cited to authoritative sources
- Reviewed by licensed attorneys
- Updated regularly for accuracy
- Clearly marked as educational (not legal advice)

---
Last Updated: ${new Date().toISOString().split('T')[0]}
Format: llms-full.txt
Version: 1.0
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
