---
title: The 20 diagrams AI can build
slug: diagram-training-guide
date: 2026-04-24
category: training
tags: Diagrams, Mermaid, PlantUML, UML, Architecture, AI Prompts
summary: A quick-pick guide for choosing the right diagram, with Mermaid and PlantUML prompts for real architecture work.
readTime: 20 min
featured: false
author: Patrick Zgambo
cover: assets/avatar/command-center.png
---

## The 20 diagrams AI can build
A working reference for engineers, architects, PMs, and technical writers. Five use-case groups, twenty diagram types, one running example - Orderly, a fictional e-commerce order platform. Every card gives you the decision rule, the risk, a rendered Mermaid preview, and ready-to-paste prompts for Mermaid.js and PlantUML.

## Start here
Use this guide as a working template, not a notation encyclopedia. Pick the communication job first, then choose the diagram that makes the system easiest to understand.

- **Best for:** engineers, architects, PMs, technical writers, and operators who need architecture diagrams without starting from a blank canvas.
- **Output:** One readable diagram per architecture question, plus prompts you can paste into Mermaid, PlantUML, or an AI coding assistant.
- **Template:** Question, when to use it, when to avoid it, rendered example, then implementation prompts.

## How each card works
Every diagram follows the same structure so you can scan fast:

1. **Decision label:** The job the diagram does.
2. **Orderly question:** The architecture question it answers.
3. **Use when:** The situation where this diagram is the clearest option.
4. **Avoid when:** The common misuse that makes the diagram misleading.
5. **Rendered example and prompt starter:** A diagram preview plus Mermaid and PlantUML prompts.

## Scenario: Orderly launch
Orderly is a new e-commerce platform going live in six weeks. One team of six, three backend services, a web UI, Stripe for payments, Shippo for shipping labels. Every diagram in this guide describes a different facet of the same system so you can see how each diagram's lens differs from the next.
- **Team:** 6 people.
- **Services:** Order, Payment, Inventory.
- **Stack:** React, Node, Go, Postgres, Kafka, AWS EKS.
- **Vendors:** Stripe, Shippo, Segment.

## Quick-pick map
- **Structure:** Class, Component, Deployment, ERD.
- **Behavior:** Flowchart, Sequence, State, Use Case.
- **Hierarchy:** Mind Map, Org Chart, WBS, JSON Tree.
- **Time:** Gantt, Timeline, User Journey, Git Graph.
- **Flow and context:** C4 Context, BPMN, Network, Sankey.

## Group 1 - What is this system made of?
Static structure. The shapes, parts, and relationships that exist whether anyone is using the system or not.

### 01 / OBJECT STRUCTURE - Class Diagram
> **Orderly question:** What objects make up our codebase and how do they relate?
**Use when:** Modeling OO code: classes, fields, methods, relationships. Onboarding new engineers to the domain model.
**Avoid when:** Audience isn't technical - use a context diagram. You have 40+ classes - show the subsystem only.

```mermaid
classDiagram
  class Order {
    +String id
    +Date createdAt
    +String status
    +calculateTotal() Money
  }
  class Customer {
    +String id
    +String email
    +placeOrder(Product[]) Order
  }
  class Product {
    +String sku
    +Money price
  }
  class LineItem {
    +int quantity
    +Money unitPrice
  }
  class Payment {
    +String provider
    +Money amount
    +capture() boolean
  }
  Customer "1" --> "*" Order : places
  Order "1" *-- "*" LineItem : contains
  LineItem "*" --> "1" Product
  Order "1" --> "1" Payment
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid classDiagram for Orderly's core domain: Customer, Order, LineItem, Product, Payment. Show fields and methods. Include multiplicities and aggregation/composition where appropriate."
```
```text
PlantUML prompt: "Generate PlantUML @startuml class diagram for Orderly's core domain (Customer, Order, LineItem, Product, Payment). Use UML composition (*--) where an Order owns its LineItems, association (-->) otherwise. Include visibility markers."
```

### 02 / LOGICAL COMPONENTS - Component Diagram
> **Orderly question:** What are the major moving parts of the system and how do they connect?
**Use when:** Showing logical modules and their connections. Architecture review / ADR supporting diagram.
**Avoid when:** Audience needs physical runtime info - use Deployment. Mixing class-level detail with component-level detail.

```mermaid
flowchart LR
  WebUI["Web UI
(React SPA)"]
  APIGW["API Gateway
(Kong)"]
  OrderSvc["Order Service
(Node.js)"]
  PaymentSvc["Payment Service
(Python)"]
  InventorySvc["Inventory Service
(Go)"]
  EventBus[("Kafka Event Bus")]
  DB[("Postgres")]
  WebUI --> APIGW
  APIGW --> OrderSvc
  APIGW --> PaymentSvc
  APIGW --> InventorySvc
  OrderSvc --> DB
  OrderSvc --> EventBus
  PaymentSvc --> EventBus
  InventorySvc --> EventBus
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid flowchart LR that approximates a UML component diagram for Orderly: Web UI, API Gateway, Order/Payment/Inventory services, Kafka event bus, Postgres. Use rectangles for services and cylinders/stadia for stores."
```
```text
PlantUML prompt: "Generate PlantUML @startuml component diagram with package boundaries for Orderly. Use [component] syntax, ()interfaces, and show the Kafka bus + Postgres as databases."
```

### 03 / RUNTIME / PHYSICAL - Deployment Diagram
> **Orderly question:** Where do these services actually run in production?
**Use when:** Documenting cloud / on-prem topology. SRE, ops, and security reviews.
**Avoid when:** Audience doesn't care about infra - use Component. Secrets / IPs would need to be on the image.

```mermaid
flowchart TB
  Browser(("Customer Browser"))
  CF["CloudFront CDN
(static assets)"]
  subgraph AWS["AWS / us-east-1"]
    subgraph EKS["EKS Cluster"]
      A["Order Svc Pod"]
      B["Payment Svc Pod"]
      C["Inventory Svc Pod"]
    end
    D[("RDS Postgres")]
    E[("S3 Assets")]
  end
  Browser --> CF --> E
  Browser --> EKS
  EKS --> D
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid flowchart TB approximating a UML deployment diagram for Orderly: CloudFront, EKS cluster with 3 service pods, RDS Postgres, S3. Group AWS resources in a subgraph."
```
```text
PlantUML prompt: "Generate PlantUML @startuml deployment diagram with proper node + artifact stereotypes for Orderly on AWS. Show EKS node containing three pod artifacts, RDS database, CloudFront edge, S3 bucket."
```

### 04 / DATA SCHEMA - Entity-Relationship Diagram
> **Orderly question:** What does the database schema look like, and how do the tables connect?
**Use when:** Designing or documenting a relational schema. Reviewing referential integrity and cardinality.
**Avoid when:** Modeling a document/graph store - use a schema sample instead. You need behavior, not shape - use Sequence/State.

```mermaid
erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
  PRODUCT ||--o{ LINE_ITEM : "referenced by"
  ORDER ||--|| PAYMENT : "paid via"
  CUSTOMER {
    uuid id
    string email
    datetime created_at
  }
  ORDER {
    uuid id
    uuid customer_id
    decimal total
    string status
  }
  PRODUCT {
    uuid id
    string sku
    decimal price
  }
  LINE_ITEM {
    uuid order_id
    uuid product_id
    int quantity
  }
  PAYMENT {
    uuid id
    uuid order_id
    string provider
    decimal amount
  }
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid erDiagram for Orderly with CUSTOMER, ORDER, LINE_ITEM, PRODUCT, PAYMENT. Use crow's-foot cardinality. Include column types (uuid, string, decimal, datetime)."
```
```text
PlantUML prompt: "Generate PlantUML @startuml ERD using 'entity' blocks with PK/FK markers for Orderly's five core tables. Include cardinality and NOT NULL hints."
```

## Group 2 - What does it DO, step by step?
Dynamic behavior. How the system executes over time: logic branches, message exchange, state transitions, and who triggers what.

### 05 / STEP-BY-STEP LOGIC - Flowchart / Activity Diagram
> **Orderly question:** What's the checkout flow, with its branches and guards?
**Use when:** Describing a process with decisions and branches. Walking non-engineers through business logic.
**Avoid when:** Actions happen concurrently across actors - use Sequence or BPMN. Diagram sprawls past one screen.

```mermaid
flowchart TD
  A(["Customer clicks Checkout"]) --> B{"Cart valid?"}
  B -- No --> Z(["Show error"])
  B -- Yes --> C["Verify inventory"]
  C --> D{"In stock?"}
  D -- No --> Z
  D -- Yes --> E["Charge payment"]
  E --> F{"Payment
approved?"}
  F -- No --> Z
  F -- Yes --> G["Create order"]
  G --> H["Send confirmation email"]
  H --> I(["Order complete"])
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid flowchart TD of Orderly's checkout flow. Rounded start/end, rectangles for actions, rhombus for decisions. Include three failure branches converging to a single error end."
```
```text
PlantUML prompt: "Generate PlantUML @startuml activity diagram (new syntax, using:action;) for Orderly's checkout flow. Use if/else blocks for guards and stop for failure branches."
```

### 06 / MESSAGES OVER TIME - Sequence Diagram
> **Orderly question:** In what order do our services exchange messages during a checkout?
**Use when:** Showing precise order of messages across actors/services. Designing or reviewing APIs and protocols.
**Avoid when:** There are 10+ participants - split or pick a slice. Flow is branchy - use a flowchart.

```mermaid
sequenceDiagram
  participant C as Customer (Web UI)
  participant G as API Gateway
  participant O as Order Service
  participant I as Inventory Svc
  participant P as Payment Svc
  participant E as Kafka
  C->>G: POST /checkout {cart}
  G->>O: createOrder(cart)
  O->>I: reserveStock(items)
  I-->>O: reserved
  O->>P: charge(customer, total)
  P-->>O: paymentId
  O->>E: publish OrderCreated
  O-->>G: 201 {orderId}
  G-->>C: 201 {orderId, receiptUrl}
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid sequenceDiagram for Orderly's checkout across Customer, API Gateway, Order, Inventory, Payment services and Kafka. Use solid arrows for calls and dashed for responses. Include an emitted OrderCreated event."
```
```text
PlantUML prompt: "Generate PlantUML @startuml sequence diagram of Orderly's checkout. Use 'actor Customer' and 'participant' for services. Include activation bars and return arrows. Add a note about idempotency key."
```

### 07 / STATES & TRANSITIONS - State Diagram
> **Orderly question:** What states can an Order be in, and what events move it between them?
**Use when:** An entity has a finite lifecycle (order, subscription, ticket). You want every legal transition in one picture.
**Avoid when:** The entity has 20+ states - group them into regions. Transitions are mostly time-based - use a timeline instead.

```mermaid
stateDiagram-v2
  [*] --> Pending
  Pending --> Paid : payment captured
  Pending --> Cancelled : timeout / user cancel
  Paid --> Shipped : warehouse dispatches
  Paid --> Refunded : refund issued
  Shipped --> Delivered : carrier confirms
  Shipped --> Returned : customer returns
  Returned --> Refunded
  Delivered --> [*]
  Cancelled --> [*]
  Refunded --> [*]
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid stateDiagram-v2 for an Orderly Order's lifecycle: Pending, Paid, Shipped, Delivered, Cancelled, Refunded, Returned. Include an entry state and end states. Label each transition with its trigger."
```
```text
PlantUML prompt: "Generate PlantUML @startuml state diagram with [*] initial/final nodes, entry/exit actions where useful, and a 'Returned' substate inside 'Delivered' as a nested region if appropriate."
```

### 08 / ACTORS & GOALS - Use Case Diagram
> **Orderly question:** Who uses the system and what are they trying to accomplish?
**Use when:** Agreeing on scope with stakeholders at kickoff. Mapping actors to goals before writing stories.
**Avoid when:** You need the HOW - use Flowchart / Sequence. You're tempted to use <<include>> everywhere - simplify.

```mermaid
flowchart LR
  Customer(("Customer"))
  CSRep(("Support Rep"))
  WH(("Warehouse"))
  subgraph Orderly["Orderly [System]"]
    UC1(("Browse catalog"))
    UC2(("Add to cart"))
    UC3(("Checkout"))
    UC4(("Track order"))
    UC5(("Refund order"))
    UC6(("Manage inventory"))
  end
  Customer --> UC1
  Customer --> UC2
  Customer --> UC3
  Customer --> UC4
  CSRep --> UC5
  WH --> UC6
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid flowchart LR that approximates a UML use case diagram for Orderly. Render actors as stick-figure circles, use cases as ellipses inside a 'system' subgraph. Keep goals verb-phrased."
```
```text
PlantUML prompt: "Generate PlantUML @startuml use case diagram for Orderly. Use 'actor' and '(Use Case)' syntax inside a rectangle 'Orderly'. Include <<extend>> from 'Refund order' to 'Checkout' if appropriate."
```

## Group 3 - How are these concepts related?
Tree-shaped information. Parents and children, whole and parts, scopes and sub-scopes.

### 09 / CONCEPT HIERARCHY - Mind Map
> **Orderly question:** What does a brainstorm of v1 features look like, before we prioritize?
**Use when:** Brainstorming before structure is locked. Kickoff sessions and scoping workshops.
**Avoid when:** The structure is truly a DAG - use a flowchart. Leaves need data/properties - use a tree table.

```mermaid
mindmap
  root((Orderly v1))
    Shopping
      Catalog
      Search
      Cart
    Checkout
      Address
      Payment
        Card
        PayPal
        Apple Pay
      Receipt
    Order Mgmt
      Tracking
      Returns
      Refunds
    Admin
      Inventory
      Reports
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid mindmap with root 'Orderly v1' and four branches (Shopping, Checkout, Order Mgmt, Admin), each with 3-4 sub-leaves. Use the double-paren circle shape for the root."
```
```text
PlantUML prompt: "Generate PlantUML @startmindmap for Orderly v1. Use '+' for right-side branches. Keep depth to 3 levels max."
```

### 10 / REPORTING TREE - Org Chart
> **Orderly question:** Who reports to whom on the launch team?
**Use when:** Showing reporting lines or escalation paths. RACI / team-topology handoffs.
**Avoid when:** People have multiple managers - shape is a graph, not a tree. Org changes every week - diagram goes stale fast.

```mermaid
flowchart TD
  CEO["Avery / CEO"]
  CTO["Blake / CTO"]
  CPO["Carmen / CPO"]
  Eng1["Dani / Backend"]
  Eng2["Evan / Frontend"]
  Eng3["Farah / SRE"]
  PM["Gus / PM"]
  CEO --> CTO
  CEO --> CPO
  CTO --> Eng1
  CTO --> Eng2
  CTO --> Eng3
  CPO --> PM
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid flowchart TD representing Orderly's 7-person org chart. Top: CEO. Direct reports: CTO, CPO. Under CTO: 3 engineers. Under CPO: 1 PM. Label each node with name + title."
```
```text
PlantUML prompt: "Generate PlantUML @startwbs (work breakdown syntax) or @startuml class diagram repurposed as an org chart. Use the 'person' stereotype and simple rectangles."
```

### 11 / WORK BREAKDOWN - Work Breakdown Structure (WBS)
> **Orderly question:** How do we decompose the 6-week launch into deliverables?
**Use when:** Program planning - decomposing scope into packages. Estimation and ownership assignment.
**Avoid when:** You're tracking progress - use Gantt or Kanban. Scope is still exploratory - use Mind Map.

```mermaid
flowchart TD
  P["Orderly Launch"]
  P --> W1["1. Design"]
  P --> W2["2. Build"]
  P --> W3["3. Test"]
  P --> W4["4. Ship"]
  W1 --> W1A["1.1 UX wireframes"]
  W1 --> W1B["1.2 API contracts"]
  W2 --> W2A["2.1 Checkout service"]
  W2 --> W2B["2.2 Payment integration"]
  W2 --> W2C["2.3 Inventory service"]
  W3 --> W3A["3.1 Load test"]
  W3 --> W3B["3.2 Security review"]
  W4 --> W4A["4.1 Beta rollout"]
  W4 --> W4B["4.2 Public launch"]
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid flowchart TD acting as a WBS. Root is 'Orderly Launch'. Four level-1 packages (Design, Build, Test, Ship). Each has 2-3 level-2 deliverables. Use WBS numbering (1.1, 2.1, etc.)."
```
```text
PlantUML prompt: "Generate PlantUML @startwbs for Orderly's 6-week launch. Use '+' for right-side children, '-' for left. Keep to 2 levels of depth."
```

### 12 / PAYLOAD / CONFIG SHAPE - JSON / YAML Tree
> **Orderly question:** What's the shape of the GET /orders/:id response payload?
**Use when:** Documenting API responses / config files at a glance. Spotting structural issues before writing code.
**Avoid when:** Schema has 100+ fields - use a schema file directly. Readers need exact types - attach the OpenAPI / JSON Schema.

```mermaid
flowchart TD
  R["OrderResponse"]
  R --> ID["id: uuid"]
  R --> ST["status: string"]
  R --> CUST["customer: Customer"]
  R --> ITEMS["items: LineItem[]"]
  R --> PAY["payment: Payment"]
  CUST --> CID["id: uuid"]
  CUST --> EM["email: string"]
  ITEMS --> QTY["quantity: int"]
  ITEMS --> PROD["product: Product"]
  PROD --> SKU["sku: string"]
  PROD --> PR["price: decimal"]
  PAY --> PROV["provider: string"]
  PAY --> AMT["amount: decimal"]
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid flowchart TD tree representing the JSON shape of Orderly's GET /orders/:id response (OrderResponse). Each node is 'key: type'. Nest objects and arrays."
```
```text
PlantUML prompt: "Generate PlantUML @startjson showing the OrderResponse payload. Use the json block syntax, include nested customer, items (array), and payment."
```

## Group 4 - When does each thing happen?
Time-ordered diagrams. Scheduling, milestones, progression, and commits.

### 13 / PROJECT SCHEDULE - Gantt Chart
> **Orderly question:** What's the 6-week launch schedule, and where are the dependencies?
**Use when:** Project schedule with tasks, durations, and dependencies. Sharing a timeline with stakeholders.
**Avoid when:** Actual work is pull-based - use Kanban. Dates shift daily - diagram becomes a lie.

```mermaid
gantt
  title Orderly / 6-Week Launch Plan
  dateFormat  YYYY-MM-DD
  axisFormat  %b %d
  section Design
    UX wireframes        :a1, 2026-05-04, 7d
    API contracts        :a2, after a1, 5d
  section Build
    Checkout service     :b1, 2026-05-12, 14d
    Payment integration  :b2, 2026-05-18, 10d
    Inventory service    :b3, 2026-05-15, 12d
  section Test
    Load test            :t1, 2026-05-26, 5d
    Security review      :t2, 2026-05-28, 4d
  section Ship
    Beta rollout         :s1, 2026-06-02, 7d
    Public launch        :crit, s2, 2026-06-09, 3d
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid gantt for Orderly's 6-week launch. Four sections (Design, Build, Test, Ship). Include an 'after' dependency and mark the public launch 'crit'."
```
```text
PlantUML prompt: "Generate PlantUML @startgantt for Orderly's 6-week launch. Define project start, tasks with durations, 'happens after' dependencies, and a red-colored critical path."
```

### 14 / EVENT SEQUENCE - Timeline
> **Orderly question:** What's the story of the company from idea to launch?
**Use when:** Telling the story of a project, company, or incident. Retro docs and all-hands slides.
**Avoid when:** You need durations and overlaps - use Gantt. Events have precise times/ordering across actors - use Sequence.

```mermaid
timeline
  title Orderly - the first year
  2025 Q3 : Idea and market research
          : Founding team formed
  2025 Q4 : Seed round ($2M)
          : First 3 engineering hires
  2026 Q1 : v0 MVP
          : 10 design partners
  2026 Q2 : Public launch
          : Series A raised
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid timeline titled 'Orderly - the first year'. Four periods (2025 Q3, Q4, 2026 Q1, Q2) each with 2 bullet events."
```
```text
PlantUML prompt: "Generate PlantUML @startuml horizontal timeline using 'concise' participants or the 'robust' timing diagram style. Keep to 4 periods and 8 events total."
```

### 15 / PERSONA / SATISFACTION - User Journey
> **Orderly question:** How does a first-time customer feel at each step of their first order?
**Use when:** UX research - surfacing friction points. Prioritization by user emotion, not task count.
**Avoid when:** You haven't talked to real users - the scores are fiction. You need system behavior - use Flowchart or Sequence.

```mermaid
journey
  title First-order customer journey
  section Discover
    Sees ad              : 3: Customer
    Clicks through       : 4: Customer
    Browses catalog      : 4: Customer
  section Purchase
    Adds to cart         : 5: Customer
    Enters address       : 2: Customer
    Pays                 : 3: Customer
  section Fulfill
    Gets confirmation    : 5: Customer
    Tracks order         : 4: Customer
    Receives package     : 5: Customer, Courier
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid journey titled 'First-order customer journey' with three sections (Discover, Purchase, Fulfill). Each action scored 1-5 with actor(s) after the colon."
```
```text
PlantUML prompt: "Generate PlantUML salt / customjourney style approximation - actually a colored horizontal Gantt with emoji/satisfaction column would work. Or recommend that Mermaid is the better tool here."
```

### 16 / BRANCH / MERGE - Git Graph
> **Orderly question:** What branching model are we using for the launch?
**Use when:** Explaining a branching model (GitFlow, trunk-based, release branches). Documenting a release cut for auditors.
**Avoid when:** You just need a list of commits - use git log. Branches are too many - show a subset.

```mermaid
gitGraph
  commit id: "init"
  branch develop
  checkout develop
  commit id: "setup"
  branch feature/checkout
  commit id: "wip"
  commit id: "tests"
  checkout develop
  merge feature/checkout
  branch release/v1
  commit id: "bump version"
  checkout main
  merge release/v1 tag: "v1.0"
  checkout develop
  commit id: "next sprint"
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid gitGraph showing Orderly's branching: main, develop, a feature/checkout branch, and a release/v1 branch. Include a merge into main and a v1.0 tag."
```
```text
PlantUML prompt: "Generate PlantUML @startuml approximation of a git branch graph using the 'rectangle' and arrow syntax, labeling each branch and tag. Or recommend Mermaid as the native tool."
```

## Group 5 - Who talks to whom, where does this fit?
Systems in context. Where the thing you're building sits relative to the rest of the world, and how volume flows between parts.

### 17 / SYSTEM IN ITS WORLD - C4 Context Diagram
> **Orderly question:** How does Orderly fit into its wider ecosystem - users, systems, and third parties?
**Use when:** First diagram in any architecture doc - frames the world. Explaining to non-engineers where the system sits.
**Avoid when:** You need internal detail - use Container/Component (C4 levels 2-3). You have no external actors - a component diagram is enough.

```mermaid
flowchart LR
  Customer(("Customer"))
  CSRep(("Support Rep"))
  subgraph S["Orderly [Software System]"]
    Sys["Orderly Platform"]
  end
  Stripe["Stripe
Payment processor"]
  Shippo["Shippo
Shipping labels"]
  Segment["Segment
Analytics"]
  Customer -->|Places orders| Sys
  CSRep -->|Issues refunds| Sys
  Sys -->|Charges cards| Stripe
  Sys -->|Buys labels| Shippo
  Sys -->|Emits events| Segment
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid flowchart LR approximating a C4 System Context diagram for Orderly. One central 'Orderly Platform' box, two person actors (Customer, Support Rep), three external systems (Stripe, Shippo, Segment). Label every arrow with the interaction."
```
```text
PlantUML prompt: "Generate PlantUML using the C4-PlantUML library (include!include https..C4_Context.puml). Use Person(), System(), System_Ext() and Rel() for the relationships. Keep arrows labeled."
```

### 18 / BUSINESS PROCESS - BPMN
> **Orderly question:** What's the end-to-end fulfillment process across customer, warehouse, and carrier?
**Use when:** Business-process docs spanning multiple departments. Auditors or BAs who read BPMN natively.
**Avoid when:** Audience is all engineering - a Sequence is simpler. You don't need the exact BPMN shapes - use swim-lane flowchart.

```mermaid
flowchart LR
  subgraph Customer["Customer"]
    A(["Order placed"])
  end
  subgraph Warehouse["Warehouse"]
    B["Pick items"]
    C["Pack shipment"]
    D["Print label"]
  end
  subgraph Carrier["Carrier"]
    E["Pick up"]
    F["Transit"]
    G(["Deliver"])
  end
  A --> B --> C --> D --> E --> F --> G
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid flowchart LR with three 'swim-lane' subgraphs (Customer, Warehouse, Carrier) for Orderly fulfillment. Rounded start/end, rectangles for tasks."
```
```text
PlantUML prompt: "Generate PlantUML @startuml activity diagram with |lane| syntax for three lanes (Customer, Warehouse, Carrier). Use the new:task syntax and:end: to close the flow."
```

### 19 / NETWORK TOPOLOGY - Network Diagram
> **Orderly question:** How is our production network laid out - subnets, gateways, tiers?
**Use when:** Network review, security assessment, VPC documentation. Onboarding SREs to the topology.
**Avoid when:** You really need packet-level flow - use a sequence or DFD. Logical architecture is enough - use Component.

```mermaid
flowchart TB
  Internet(("Internet"))
  WAF["WAF / DDoS"]
  LB["Application LB"]
  subgraph VPC["VPC / 10.0.0.0/16"]
    subgraph PubSN["Public Subnet"]
      NAT["NAT Gateway"]
    end
    subgraph PrivSN["Private Subnet"]
      Web["Web Tier"]
      App["App Tier"]
      DB[("DB Tier")]
    end
  end
  Internet --> WAF --> LB --> Web
  Web --> App --> DB
  App --> NAT --> Internet
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid flowchart TB network diagram for Orderly: Internet -> WAF -> LB, nested VPC subgraph with public subnet (NAT) and private subnet (Web, App, DB tiers). Show egress via NAT to Internet."
```
```text
PlantUML prompt: "Generate PlantUML @startuml using 'nwdiag' or standard boxes to show the VPC, public/private subnets, tiers, WAF, LB, and NAT. Use CIDR annotations."
```

### 20 / FLOW VOLUME - Sankey Diagram
> **Orderly question:** Where does traffic enter the funnel and where does it leak out?
**Use when:** Showing volume flowing and splitting between nodes. Funnel analysis, attribution, cost flows.
**Avoid when:** Two tiny stages - a funnel chart is cleaner. There's no shared substance flowing - use a flowchart.

```mermaid
sankey-beta
Organic,Landing,10000
Paid,Landing,8000
Email,Landing,4000
Landing,Product,12000
Landing,Bounce,10000
Product,Cart,6000
Product,Bounce,6000
Cart,Checkout,4500
Cart,Abandoned,1500
Checkout,Paid Order,3800
Checkout,Failed,700
```

**Prompt starter:**
```text
Mermaid prompt: "Build a Mermaid sankey-beta for Orderly's funnel: three sources (Organic, Paid, Email) into Landing, then into Product/Bounce, then Cart/Checkout/Paid Order, with leak outs at each stage."
```
```text
PlantUML prompt: "PlantUML has no native Sankey - recommend Mermaid for Sankey, or generate a matplotlib/plotly script. Optionally produce an ASCII approximation."
```

## How to use this guide
Ask the model for one diagram at a time. Name the audience, the system boundary, the exact nodes, and the output format before asking for syntax.
