# ChromaBASE — Complete User Guide

> **For everyone.** No technical background required.

---

## Table of Contents

1. [What is ChromaBASE?](#1-what-is-chromabase)
2. [Getting Started & Signing In](#2-getting-started--signing-in)
3. [Finding Your Way Around](#3-finding-your-way-around)
4. [Dashboard — Your Home Base](#4-dashboard--your-home-base)
5. [Leads — Your Sales Pipeline](#5-leads--your-sales-pipeline)
6. [Accounts — Managing Clients](#6-accounts--managing-clients)
7. [Deals — Closing Revenue](#7-deals--closing-revenue)
8. [Contacts — People You Work With](#8-contacts--people-you-work-with)
9. [Tasks — Getting Things Done](#9-tasks--getting-things-done)
10. [Calendar — Your Schedule](#10-calendar--your-schedule)
11. [Proposals — Winning Business](#11-proposals--winning-business)
12. [Quotes — Pricing & Invoicing](#12-quotes--pricing--invoicing)
13. [Campaigns — Marketing](#13-campaigns--marketing)
14. [Team Hub — Your People](#14-team-hub--your-people)
15. [Reports — Understanding Performance](#15-reports--understanding-performance)
16. [Workflows — Automation](#16-workflows--automation)
17. [Settings — Making It Yours](#17-settings--making-it-yours)
18. [API Explorer — For the Tech-Curious](#18-api-explorer--for-the-tech-curious)
19. [Keyboard Shortcuts & Power Tips](#19-keyboard-shortcuts--power-tips)
20. [Frequently Asked Questions](#20-frequently-asked-questions)

---

## 1. What is ChromaBASE?

ChromaBASE is a **CRM** — a Customer Relationship Manager. Think of it as your team's shared brain for everything sales and client-related.

Instead of juggling:
- Spreadsheets with lead lists
- Sticky notes about follow-ups
- Email threads to track proposals
- Group chats to assign tasks

…ChromaBASE puts it all in **one place**, visible to your whole team, always up to date.

### The Big Picture

```
A potential customer hears about you
           ↓
      They become a LEAD
           ↓
  You contact them — update lead status
           ↓
  You pitch them — create a PROPOSAL
           ↓
  They agree — create a DEAL
           ↓
  They sign — convert to an ACCOUNT (Client)
           ↓
  You deliver — manage TASKS & CONTACTS
```

Every step of that journey lives in ChromaBASE.

---

## 2. Getting Started & Signing In

### Signing In

1. Open ChromaBASE in your browser
2. Click **"Sign in"** in the top-right corner
3. Click **"Sign in with Google"** — use your work Google account
4. You're in

> **No password to remember.** ChromaBASE uses your existing Google account.

### First Time Here?

When you first log in, you'll see the **Dashboard** — your overview of everything. Don't worry if it looks empty; that's normal for a fresh setup. Start by adding your first lead (see [Section 5](#5-leads--your-sales-pipeline)).

### Signing Out

Click your **profile picture** in the top-right → **Log out**

---

## 3. Finding Your Way Around

### The Layout

```
┌─────────────────────────────────────────────────────┐
│  [Logo] ChromaBASE          [Search]   [🔔] [Avatar] │  ← Header
├────────────────┬────────────────────────────────────┤
│                │                                     │
│   Sidebar      │         Page Content                │
│                │                                     │
│  Dashboard     │  (This is where everything shows)   │
│  Leads         │                                     │
│  Accounts      │                                     │
│  Deals         │                                     │
│  Contacts      │                                     │
│  ─────────     │                                     │
│  WORKSPACE     │                                     │
│  Tasks         │                                     │
│  Calendar      │                                     │
│  Campaigns     │                                     │
│  Proposals     │                                     │
│  Quotes        │                                     │
│  ─────────     │                                     │
│  TEAM          │                                     │
│  Team Hub      │                                     │
│  Reports       │                                     │
│  ─────────     │                                     │
│  API Explorer  │                                     │
│  Settings      │                                     │
│                │                                     │
└────────────────┴────────────────────────────────────┘
```

### The Sidebar (Left)

This is your main navigation. Click any item to go to that section. The sidebar is divided into 3 groups:

| Group | Pages |
|-------|-------|
| **Main** | Dashboard, Leads, Accounts, Deals, Contacts |
| **Workspace** | Tasks, Calendar, Campaigns, Proposals, Quotes |
| **Team** | Team Hub, Reports |

The sidebar can **collapse** to icon-only mode — hover over it and click the `‹` arrow that appears. Click `›` to expand it back.

### The Header (Top)

| Element | What It Does |
|---------|-------------|
| **Search bar** | Find anything — leads, accounts, contacts, tasks. Click it or press `⌘K` |
| **🔔 Bell** | Your notifications — new tasks, mentions, system alerts |
| **☀️/🌙 Toggle** | Switch between light and dark mode |
| **Profile picture** | Your account menu — profile, settings, log out |

### On Mobile

The sidebar hides automatically on small screens. Tap the **☰ menu icon** in the top-left to open it.

---

## 4. Dashboard — Your Home Base

**URL:** `/`

The Dashboard is the first thing you see every day. It gives you a snapshot of your entire business.

### What You'll See

#### KPI Cards (Top Row)
Four summary numbers at a glance:

| Card | Shows You |
|------|-----------|
| **Total Leads** | How many leads are in your pipeline |
| **Active Accounts** | Number of paying/active clients |
| **Open Deals** | Total value of deals in progress |
| **Pending Tasks** | Tasks that need your attention |

#### Activity Feed (Left Panel)
A real-time stream of what's happening — calls logged, status changes, notes added, deals moved. Think of it like your team's news feed.

#### Unified Calendar (Center Panel)
A live calendar showing your upcoming appointments and task due dates, all in one view. See what's happening today, tomorrow, and this week without switching tabs.

#### Priority Tasks (Right Panel)
Your most urgent to-dos. Tasks are colour-coded:
- 🔴 **Red dot** = High priority
- 🟡 **Yellow dot** = Medium priority
- 🔵 **Blue dot** = Low priority

Use the **All / High / Medium / Low** filter buttons to focus on what matters.

Click the small circle next to a task to **mark it complete** directly from the dashboard.

#### Pipeline Strip (Bottom)
A visual bar showing your active deals sorted by stage. At a glance, see where your revenue is in the funnel.

### Quick Action
Click **"+ New Lead"** in the page header to add a lead without leaving the dashboard.

---

## 5. Leads — Your Sales Pipeline

**URL:** `/leads`

A **lead** is anyone who might become a customer. They haven't signed yet — you're still working on them.

### Two Ways to View Leads

**Kanban Board** (default) — Visual columns by status:
```
┌──────────┐ ┌───────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────┐ ┌──────┐
│   NEW    │ │ CONTACTED │ │   MEETING    │ │   PROPOSAL   │ │ WON │ │ LOST │
│          │ │           │ │  SCHEDULED   │ │     SENT     │ │     │ │      │
│ [Card]   │ │ [Card]    │ │ [Card]       │ │ [Card]       │ │     │ │      │
│ [Card]   │ │ [Card]    │ │              │ │              │ │     │ │      │
└──────────┘ └───────────┘ └──────────────┘ └──────────────┘ └─────┘ └──────┘
```

**List View** — A table with all leads in rows (great for sorting and scanning many leads).

Switch between them using the toggle buttons in the top-right of the page.

### Lead Statuses Explained

| Status | Meaning |
|--------|---------|
| **New Lead** | Just entered your system, not yet contacted |
| **Contacted** | You've reached out — call, email, LinkedIn, etc. |
| **Meeting Scheduled** | A meeting or demo is booked |
| **Proposal Sent** | You've sent them a formal proposal |
| **Won** | They became a client — celebrate! 🎉 |
| **Lost** | They went elsewhere or decided not to proceed |

### Adding a New Lead

1. Click **"+ New Lead"** button (top-right of the Leads page)
2. Fill in the form:
   - **Company Name** — Their business name
   - **Contact Name** — The person you're talking to
   - **Email** — Their work email
   - **Phone** — Optional
   - **Source** — How did you find them? (referral, website, cold outreach, etc.)
   - **Value** — Estimated deal value in dollars
   - **Assigned To** — Which team member owns this lead
   - **Notes** — Anything important to remember
3. Click **Save**

### Moving a Lead Forward

**Drag and drop** in Kanban view — grab a lead card and drop it into the next column.

Or open the lead and change the status from the dropdown inside.

### Searching & Filtering

- Use the **search bar** to find a lead by company name or contact name
- Use the **status filter** dropdown to show only leads in a specific stage
- The counter shows: `Showing X of Y leads` — and the total value of visible leads

### Lead Detail Page

Click any lead card/row to open its full details. Here you can:
- Edit all lead information
- See the full activity timeline
- Add notes
- Send a quick email (click the ✉️ icon)
- Schedule a meeting (click the 📅 icon)
- Right-click any lead row for a context menu with all quick actions

---

## 6. Accounts — Managing Clients

**URL:** `/accounts`

**Accounts** are your actual paying clients — leads that became customers. This section is your client relationship hub.

### Accounts List

The accounts list shows all your clients with:
- Company name and status badge
- Industry
- Total revenue
- Account manager assigned

Click any account to open its full profile.

### Account Detail Page

This is the most powerful page in ChromaBASE. It's your 360° view of a single client.

#### Header Section
Shows company name, status (Active/Inactive/Onboarding), account manager, and when they became a client. The **Edit** button lets you update any of this.

#### Left Sidebar (Account Overview)
Quick-reference facts:
- **Status** — Is this client active?
- **Industry** — What sector they're in
- **Total Revenue** — Lifetime value from this account
- **Website** — Click to visit their site
- **Onboarding Progress** — A progress bar (0–100%) if they're still being onboarded
- **Primary Contact** — The main person you deal with, their email and phone

#### The 5 Tabs (Main Content Area)

**① Contacts**
Everyone at this company you're in contact with. You can:
- See all their names, titles, emails, phones
- Add a new contact (click "+ Add Contact")
- See which contact is marked as Primary

**② Deals**
All active and past deals with this client:
- Deal name and current stage
- Deal value
- Expected close date
- Click "New Deal" to create one linked to this account

**③ Proposals**
All proposals you've sent this client:
- Proposal title, status, value
- When it was sent and when it expires
- Click to view the proposal content

**④ Tasks**
Tasks specifically related to this account:
- All open to-dos for this client
- Priorities and due dates
- Add tasks directly from here

**⑤ Activity**
A full timeline of every interaction:
- Calls logged, emails sent, meetings held
- Status changes, notes added
- Who did what and when
- Timestamps for everything

### Account Status

| Status | Means |
|--------|-------|
| **Active** | Currently a paying client |
| **Onboarding** | Recently signed, being set up |
| **Inactive** | No longer active (churned, paused) |

### Client Tiers

| Tier | Typically Means |
|------|----------------|
| **Gold** | Top-tier, high-value client |
| **Silver** | Mid-tier client |
| **Bronze** | Growing client |
| **Standard** | Regular client |

---

## 7. Deals — Closing Revenue

**URL:** `/deals`

**Deals** track specific revenue opportunities with existing clients (or advanced leads). While a Lead is "maybe they'll buy," a Deal is "we're actively selling them something."

### Deal Stages

```
LEAD → QUALIFIED → PROPOSAL → NEGOTIATION → CLOSED WON
                                                  ↓
                                            CLOSED LOST
```

| Stage | What It Means |
|-------|---------------|
| **Lead** | Initial opportunity identified |
| **Qualified** | You've confirmed they're a real buyer |
| **Proposal** | You've presented a formal offer |
| **Negotiation** | You're discussing terms and price |
| **Closed Won** | Deal signed — revenue earned |
| **Closed Lost** | Deal fell through |

### Kanban Board for Deals

Just like Leads, Deals uses a Kanban board. **Drag cards between columns** to advance a deal through the stages.

### Creating a New Deal

1. Click **"+ New Deal"**
2. Fill in:
   - **Deal Name** — A clear, descriptive name (e.g., "Acme Corp — Enterprise Plan 2025")
   - **Client** — Which account this is for
   - **Value** — Dollar amount of this deal
   - **Stage** — Where it currently sits
   - **Close Date** — When you expect to close
   - **Owner** — Team member responsible
   - **Probability** — Your estimate of winning (%)
   - **Notes** — Context or next steps
3. Click **Save**

### Searching & Filtering

- **Search** by deal name
- **Filter** by stage to see only deals in a specific phase
- The pipeline **total value** and deal count update in real time as you filter

---

## 8. Contacts — People You Work With

**URL:** `/contacts`

Contacts are the **individual people** inside your client companies. Every account can have multiple contacts.

### Contact Fields

| Field | Notes |
|-------|-------|
| **First & Last Name** | Full name |
| **Email** | Work email address |
| **Phone** | Optional |
| **Job Title** | Their role (e.g., "Head of Procurement") |
| **Company/Account** | Which client they belong to |
| **Primary Contact** | Is this the main decision-maker? |
| **Last Contacted** | When you last spoke — tracks relationship health |

### Adding a Contact

1. Click **"+ New Contact"**
2. Fill in their details
3. **Assign to an Account** — search for their company
4. Check **"Primary Contact"** if they're the main person at that company
5. Click **Save**

### Searching & Filtering

- **Search** by name, email, or company name
- **Filter by account** to see all contacts at a specific client
- The results counter shows how many contacts match

### Contact Actions

- **Edit** — Click the edit icon to update their info
- **Delete** — Remove a contact (asks for confirmation)
- **Email** — Click their email to open your mail client
- **Call** — Click their phone number to dial (on mobile)

---

## 9. Tasks — Getting Things Done

**URL:** `/tasks`

Tasks are your to-do list — but smarter. They can be linked to leads, clients, or deals, assigned to teammates, and tracked with priorities and deadlines.

### Task Types

| Type | Icon | Means |
|------|------|-------|
| **To-Do** | ☑️ | Generic action item |
| **Call** | 📞 | Phone call to make |
| **Meeting** | 👥 | Meeting to prepare for |
| **Email** | ✉️ | Email to send |

### Task Priority Levels

| Priority | Colour | Use When |
|----------|--------|---------|
| **Urgent** | 🔴 Red | Drop everything — needs immediate attention |
| **High** | 🟠 Orange | Must happen today or tomorrow |
| **Medium** | 🟡 Yellow | This week |
| **Low** | 🔵 Blue | Eventually, no hard deadline |

### Task Status Flow

```
TO DO  →  IN PROGRESS  →  REVIEW  →  COMPLETED
```

### Creating a Task

1. Click **"+ New Task"**
2. Fill in:
   - **Title** — Clear, actionable (e.g., "Call Sarah at Acme to discuss renewal")
   - **Type** — Call, Meeting, Email, or To-Do
   - **Priority** — How urgent is this?
   - **Due Date** — When does it need to be done?
   - **Assigned To** — Who's responsible?
   - **Related To** — Link to a lead, client, or deal
   - **Description** — Extra details or context
   - **Tags** — Labels for easy filtering (e.g., "renewal", "follow-up")
3. Click **Save**

### Advanced Task Features

**Subtasks** — Break a complex task into smaller steps:
- Open a task → Add subtask items
- Check them off one by one

**Task Dependencies** — Some tasks can't start until others finish:
- "Blocked by" — This task can't start until another is done
- "Blocking" — Other tasks are waiting on this one

**Recurring Tasks** — Tasks that repeat automatically:
- Choose frequency: Daily, Weekly, or Monthly
- Set an interval (e.g., every 2 weeks)
- Set an optional end date

**Time Tracking** — Track time spent on billable work:
- Start the timer when you begin
- Stop it when you're done
- See total time spent on the task

### Bulk Actions

Select multiple tasks using checkboxes → Use the bulk action bar to:
- Change status for all selected
- Delete multiple tasks at once
- Reassign to a different team member

---

## 10. Calendar — Your Schedule

**URL:** `/calendar`

The Calendar gives you a visual overview of all your **appointments and task deadlines** in one place.

### What Shows on the Calendar

- **Appointments** — Booked meetings, calls, consultations
- **Tasks with due dates** — When something needs to be done

Colour-coded so you can tell them apart at a glance.

### Appointment Types

| Type | When to Use |
|------|------------|
| **Call** | Phone or video call |
| **Meeting** | In-person or virtual meeting |
| **Consultation** | Longer advisory session |
| **Follow-up** | Checking back in after a previous interaction |

### Appointment Status

| Status | Means |
|--------|-------|
| **Scheduled** | Booked and upcoming |
| **Completed** | Already happened |
| **Cancelled** | Was booked but called off |
| **No Show** | They didn't turn up |

### Creating an Appointment

1. Click **"+ New Event"** or click on a date/time in the calendar
2. Fill in:
   - **Title** — e.g., "Demo call with Acme Corp"
   - **Description** — Agenda or notes
   - **Start & End Time** — Date and time
   - **Type** — Call, Meeting, Consultation, Follow-up
   - **Location** — Office address, Zoom link, etc.
   - **Video Link** — Paste a Zoom/Meet/Teams URL
   - **Client/Lead** — Link to who this meeting is with
   - **Assigned To** — Which team member owns this event
3. Click **Save**

---

## 11. Proposals — Winning Business

**URL:** `/proposals`

Proposals are formal documents you send to potential clients explaining what you'll do for them and how much it costs.

### Proposal Lifecycle

```
DRAFT  →  SENT  →  UNDER REVIEW  →  APPROVED
                                 ↓
                              REJECTED  or  EXPIRED
```

| Status | What It Means |
|--------|---------------|
| **Draft** | Being written, not sent yet |
| **Sent** | Client has received it |
| **Under Review** | Client is considering it |
| **Approved** | They said yes! Convert to a deal/client |
| **Rejected** | They declined |
| **Expired** | Validity date passed without a response |

### Creating a Proposal

1. Click **"+ New Proposal"**
2. Fill in:
   - **Title** — Descriptive name (e.g., "Digital Transformation Proposal for Acme Corp")
   - **Client** — Which account this is for
   - **Lead** — Or link to a lead if not yet a client
   - **Value** — Total proposal value
   - **Valid Until** — Expiry date for the offer
   - **Content** — The proposal body (supports Markdown formatting)
   - **Attachments** — Upload files or paste URLs
3. Click **Save**

### Proposal Tips

- Keep the **Valid Until** date visible — expired proposals need to be renewed
- Mark as **Sent** as soon as you email it to the client
- Update to **Approved** when they sign → then create a Deal from it

---

## 12. Quotes — Pricing & Invoicing

**URL:** `/quotes`

Quotes are **itemised pricing documents** — more granular than proposals. They list specific products/services, quantities, and prices.

### Quote Statuses

| Status | Means |
|--------|-------|
| **Draft** | Being prepared |
| **Sent** | Client has it |
| **Viewed** | Client opened it |
| **Accepted** | Client approved — ready to invoice |
| **Declined** | Client said no |

### Creating a Quote

1. Click **"+ New Quote"**
2. Fill in the basics:
   - **Title** — e.g., "Q4 2025 Website Redesign Quote"
   - **Client** — Which account
   - **Deal** — Link to a deal if applicable
   - **Valid Until** — Expiry date
3. **Add line items** — for each product/service:
   - Description
   - Quantity
   - Unit price
   - (Total auto-calculates)
4. **Add tax** as a percentage if applicable
5. **Notes** — Payment terms, special conditions
6. Click **Save**

### Quote Detail Page (`/quotes/[id]`)

A full view of the quote with:
- All line items and pricing
- Subtotal, tax, and grand total
- Status history
- Option to mark as sent/accepted/declined

---

## 13. Campaigns — Marketing

**URL:** `/campaigns`

Campaigns let you track your marketing activities — email blasts, social media campaigns, ads, webinars, and more.

### Campaign Types

| Type | Examples |
|------|---------|
| **Email** | Newsletter, drip sequence, promotion |
| **Social** | LinkedIn/Instagram/Facebook posts |
| **Ad** | Google Ads, Meta Ads, sponsored content |
| **Webinar** | Online events, workshops |
| **Other** | Anything else |

### Campaign Statuses

```
DRAFT  →  SCHEDULED  →  ACTIVE  →  COMPLETED
                            ↓
                          PAUSED
```

### Campaign Metrics (Auto-Tracked)

| Metric | What It Measures |
|--------|-----------------|
| **Sent** | How many people received it |
| **Opened** | How many opened/viewed it |
| **Clicked** | How many clicked a link |
| **Converted** | How many took the desired action |
| **Revenue** | How much revenue it generated |

### Creating a Campaign

1. Click **"+ New Campaign"**
2. Fill in:
   - **Name** — Clear name for internal reference
   - **Type** — Email, Social, Ad, Webinar, Other
   - **Start Date** — When it launches
   - **End Date** — When it wraps up (optional for ongoing campaigns)
   - **Budget** — Total planned spend
3. Click **Save**
4. Update **metrics and spent** as the campaign runs

---

## 14. Team Hub — Your People

**URL:** `/team`

Team Hub shows everyone on your ChromaBASE team and their current workload.

### What You'll See

Each team member has a card showing:
- Name, role, and profile picture
- Their assigned leads and deals
- Active task count
- Performance metrics

### Team Member Detail Page (`/team/[id]`)

Click any team member to see:
- Their full profile
- All assigned leads
- All assigned deals
- All open tasks
- Activity history
- Goals and performance

### User Roles

| Role | Access Level |
|------|-------------|
| **Admin** | Full access to everything, including settings |
| **Sales Manager** | Can see all team data, assign leads/deals |
| **Account Manager** | Manages their assigned accounts and leads |
| **Marketing** | Access to campaigns and reports |
| **Member** | Standard access to their own records |

---

## 15. Reports — Understanding Performance

**URL:** `/reports`

Reports give you the numbers — how your team and pipeline are performing.

### What's Measured

#### Sales Performance
- Total revenue this month / quarter / year
- Revenue vs. target
- Win rate (deals won ÷ total deals closed)
- Average deal size

#### Pipeline Health
- Total pipeline value
- Deals by stage
- Average time in each stage
- Deals at risk (no activity in X days)

#### Team Activity
- Calls made, emails sent, meetings held
- Tasks completed per team member
- Leads added per team member
- Response time averages

#### Lead Analytics
- Lead sources (where are your best leads coming from?)
- Lead-to-deal conversion rate
- Average time from lead to close

#### Campaign ROI
- Revenue attributed to each campaign
- Cost per acquisition
- Return on ad spend

### Using Reports

- Use the **date range picker** to see any time period
- Use **filter by team member** to review individual performance
- Most charts are interactive — hover for exact numbers

---

## 16. Workflows — Automation

**URL:** `/workflows`

Workflows let ChromaBASE **do repetitive tasks for you** automatically. Set up a rule once, and it runs itself.

### How Workflows Work

```
TRIGGER  →  (CONDITION)  →  ACTION
```

| Part | What It Does |
|------|-------------|
| **Trigger** | The event that starts the automation |
| **Condition** | (Optional) Extra rules to filter when it applies |
| **Action** | What happens automatically |

### Available Triggers

| Trigger | Fires When... |
|---------|--------------|
| **Task Completed** | A task is marked done |
| **Client Created** | A new account is added |
| **Task Overdue** | A task passes its due date |
| **Task Status Changed** | A task moves between statuses |

### Available Actions

| Action | Does This Automatically |
|--------|------------------------|
| **Create Task** | Adds a new task to the system |
| **Send Notification** | Sends an alert to a team member |
| **Update Task** | Changes a task's status or fields |

### Example Workflows

**"Follow-up reminder after proposal sent"**
- Trigger: Task with title containing "Proposal" is marked Complete
- Action: Create new task "Follow up on proposal" due in 3 days, assigned to same person

**"Alert when deal is won"**
- Trigger: Deal stage changes to Closed Won
- Action: Send notification to Sales Manager

**"Onboarding task when client added"**
- Trigger: New Client Created
- Action: Create task "Send welcome email to [client]" assigned to their account manager

### Creating a Workflow

1. Click **"+ New Workflow"**
2. **Name it** — something descriptive
3. **Choose a trigger** — what kicks this off?
4. **(Optional) Set conditions** — narrow down when it fires
5. **Choose an action** — what should happen?
6. **Configure the action** — fill in details for the action
7. Toggle **Active** to turn it on
8. Click **Save**

### Workflow Logs

Every time a workflow runs, it's logged. Click any workflow to see:
- When it last triggered
- Whether it succeeded or failed
- Details about what happened

---

## 17. Settings — Making It Yours

**URL:** `/settings`

Settings has 5 tabs:

### ① Profile

Update your personal information:
- **Avatar** — Upload a profile photo
- **First & Last Name**
- **Email address**

Click **Save Changes** after updating.

### ② Appearance

Choose how ChromaBASE looks:

| Theme | When to Use |
|-------|------------|
| **Light** | Bright, clean — good for well-lit offices |
| **Dark** | Easy on the eyes — great for evening work |
| **System** | Automatically matches your device's setting |

Click the theme card to apply instantly. No need to save.

### ③ Notifications

Control what alerts you get:

**Email Notifications:**
- Lead updates — get emailed when leads change status
- Task reminders — get emailed about upcoming due dates
- Marketing reports — weekly/monthly campaign summaries

**In-App Alerts:**
- Client activity — see alerts when accounts update
- Mentions — get notified when a teammate mentions you

Toggle each switch on or off, then click **Save Preferences**.

### ④ API & Data

For admin use:

- See whether the app is running in Demo Mode (with sample data) or Live Mode
- View required Firebase environment variables for setup
- Find quick links to common API endpoints
- **Danger Zone** — Reset local cache and state (use only if asked by your admin)

### ⑤ Integrations

**Discord Webhook**

Get automatic notifications in your Discord server:

1. Go to your Discord server → Server Settings → Integrations → Webhooks → New Webhook
2. Copy the webhook URL
3. Paste it into the **Webhook URL** field in ChromaBASE Settings → Integrations
4. Enable the alerts you want:
   - **High Priority Task Reminders** — Alert 2 hours before high-priority task deadlines
   - **Deal Stage Change Alerts** — Get notified in Discord when deals are Won or Lost
5. Click **Test Connection** to make sure it works
6. Click **Save Integration**

---

## 18. API Explorer — For the Tech-Curious

**URL:** `/api-docs`

The API Explorer is for developers and technically-minded users who want to connect ChromaBASE to other tools or build custom integrations.

You can:
- Browse all available API endpoints
- See request and response examples
- Test API calls directly in the browser
- Find authentication instructions

> **Not a developer?** You can safely ignore this section — it's for technical integrations only.

---

## 19. Keyboard Shortcuts & Power Tips

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` (Mac) / `Ctrl+K` (Windows) | Open the **Command Palette** — search everything |
| `Escape` | Close any open modal or dialog |

### Command Palette (`⌘K`)

The Command Palette is like a supercharged search. Press `⌘K` from anywhere and:
- Search leads by company or contact name
- Find accounts, deals, tasks, and contacts
- Navigate directly to any page by typing its name
- Jump to recently visited records

### Right-Click Context Menu

On the Leads list, **right-click any row** to get a quick context menu:
- View Details
- Edit Lead
- Send Email
- Schedule Meeting
- Delete Lead (with shortcut `⌘⌫`)

### Power User Tips

**1. Drag and drop on any Kanban board**
Both Leads and Deals have Kanban boards. Grab a card and drop it into any column to update its status instantly — no forms needed.

**2. Inline quick actions**
On lists and tables, **hover over a row** to reveal action buttons (email, calendar, etc.) that appear on the right side.

**3. Filter + Search together**
You can use both filters AND search at the same time. Filter by "Status: Won" and search for "Acme" to find a specific won lead.

**4. Tab navigation in Account detail**
The Account detail page has 5 tabs. Use them as your single source of truth for a client — you shouldn't need to go anywhere else.

**5. Task due today / overdue highlighting**
Overdue tasks show in **red**, tasks due today show in **yellow**. Check your Priority Tasks panel on the Dashboard every morning.

**6. Notification bell**
The 🔔 bell shows a badge when you have unread notifications. Click it to open a dropdown — click each notification to go directly to the related item.

---

## 20. Frequently Asked Questions

**Q: How do I delete something by accident?**
Most delete actions show a confirmation dialog — you'll be asked to confirm before anything is permanently removed. If you've already confirmed, contact your admin immediately as deletions may be recoverable depending on your setup.

---

**Q: What's the difference between a Lead and a Deal?**
A **Lead** is someone you're prospecting — they haven't committed to anything yet. A **Deal** is a specific revenue opportunity that's actively in progress, usually linked to an existing client account. Think of it this way: Leads become Deals; Deals become Accounts.

---

**Q: What's the difference between a Proposal and a Quote?**
A **Proposal** is a high-level document explaining *what* you'll do and *why* the client should choose you — it's persuasive and strategic. A **Quote** is an itemised price list showing *exactly what* will be delivered and *how much* each item costs.

---

**Q: Can two people work on the same account at the same time?**
Yes. ChromaBASE is a shared workspace — multiple team members can view and edit records simultaneously. Changes are visible in real time.

---

**Q: How do I know who's responsible for what?**
Every lead, deal, task, and account has an **"Assigned To"** or **"Owner"** field. This is the person responsible. You can filter any list by assignee to see someone's full workload.

---

**Q: What happens when I mark a lead as "Won"?**
The lead status changes to Won (shown in green on the Kanban). You should then create a new **Account** for them and a **Deal** to track the revenue. Some teams also create an initial **Task** like "Begin onboarding."

---

**Q: How do recurring tasks work?**
When you create a task with recurrence enabled, ChromaBASE automatically generates the next instance of the task once the current one is completed. For example, a "Weekly report" task set to repeat every Monday will automatically create next Monday's task as soon as you check off this week's.

---

**Q: Why does the calendar show tasks AND appointments?**
The calendar is your unified schedule view. Tasks have due dates (deadlines), and appointments have specific time slots. Seeing them together prevents double-booking and helps you plan your day realistically.

---

**Q: Can I change a contact's associated company?**
Yes — open the contact, click Edit, and reassign the **Account** field to a different company.

---

**Q: What's the Pipeline Strip on the dashboard?**
It's a visual bar chart showing your active deals sorted by value and stage. It helps you instantly see where your revenue is concentrated in the funnel — for example, if all your deals are stuck in "Proposal" and nothing is in "Negotiation," you know to focus on closing.

---

**Q: What does the green dot in the bottom-left of the sidebar mean?**
That's the **API Connected** indicator — it shows ChromaBASE is successfully communicating with its backend. If it turns grey or disappears, there may be a connectivity issue.

---

**Q: I'm on mobile — is the full app available?**
Yes. On smaller screens, the sidebar turns into a slide-out menu (tap ☰), and the dashboard switches to a **vertical feed** view optimised for scrolling. Most features are available; some complex views like the Kanban board may be easier on desktop.

---

**Q: How do I get help?**
1. Check this guide first
2. Ask your team admin
3. For bugs or technical issues, contact your system administrator

---

*Last updated: March 2026 | ChromaBASE CRM*
