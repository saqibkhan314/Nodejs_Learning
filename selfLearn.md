# Business Logic at Scale: Event-Driven & CQRS

When dealing with complex workflows such as order processing, video upload pipelines, or distributed transactions, traditional monolithic ACID transactions become a bottleneck. Locking tables and maintaining strict consistency across all operations simply doesn't scale.

To overcome these challenges, modern systems adopt **event‑driven architectures** combined with patterns like **Event Sourcing**, **CQRS**, and the **Saga Pattern**. These approaches enable high scalability, resilience, and flexibility while providing features like audit trails and asynchronous read‑model updates.

**ACID transactions become a bottleneck**

"ACID transactions become a bottleneck"
```
The database spends so much time making sure data is always 100% correct and consistent that it becomes slower when millions of users are using the system.
```
- First, What is ACID?

    - ACID is a set of rules followed by databases like:

        - PostgreSQL
       - MySQL
       - Oracle
       - SQL Server

- ACID means:

- Letter Meaning
```
A	Atomicity
C	Consistency
I	Isolation
D	Durability 
```

```
Example: Bank Transfer

Suppose you have ₹1000.

You transfer ₹500 to your friend.
```

```
Database operations:

UPDATE users
SET balance = balance - 500
WHERE id = 1;

UPDATE users
SET balance = balance + 500
WHERE id = 2;

```

- If power goes off after first query:

```
Before:

You = 1000
Friend = 500

After first query:

You = 500
Friend = 500
```

**Money disappeared.**

- That's bad.

 - ACID Solves This

- Database does:

```
BEGIN;

UPDATE users
SET balance = balance - 500
WHERE id = 1;

UPDATE users
SET balance = balance + 500
WHERE id = 2;

COMMIT;

Now either:

Success
You = 500
Friend = 1000

OR

Failure
You = 1000
Friend = 500
```

- No middle state.

 - This is ACID.

```
Let's Understand Each Letter
A = Atomicity

Atomic means:

All or Nothing

Example:

Transfer money:

Step 1 → Deduct money
Step 2 → Add money

If Step 2 fails:

Database automatically cancels Step 1.

C = Consistency

Database rules must remain true.

Example:

Balance can never be negative.

balance >= 0

If transaction breaks rule:

Rejected

Database stays consistent.

I = Isolation

Imagine:

Two people buying last iPhone.

Stock:

1 phone left

User A:

Read stock = 1

User B:

Read stock = 1

Without isolation:

Both buy

Now:

Stock = -1

Impossible.

Isolation makes transactions behave as if they happen one at a time.

Database uses:

Locks
MVCC (Multi Version Concurrency Control)

to prevent conflicts.

D = Durability

After transaction is committed:

COMMIT;

```

- Even if:

    - Power fails
    - Server crashes
    - Database restarts

- Data remains safe.

- Because database first writes to:

- Transaction Log

- before confirming success.

---

## Event Sourcing

Instead of storing only the current state of an entity, **Event Sourcing** persists every state change as an immutable sequence of events. Each event represents a fact that happened in the system.

**Example – Video Upload Pipeline:**

- `VideoUploaded`
- `EncodingStarted`
- `EncodingDone`
- `Published`

**Benefits:**

- **Audit Trail** – Every change is recorded, providing a complete history.
- **Replayability** – You can rebuild the current state (or any past state) by replaying events.
- **Multiple Views** – Different projections can be built from the same event stream to serve diverse use cases.

---

## CQRS (Command Query Responsibility Segregation)

**CQRS** separates the write model (commands) from the read model (queries). Writes are handled by the command side, typically using an event store, while reads are served by materialised views that are updated asynchronously.

**How it works:**

- **Commands** – Mutating operations (e.g., update metadata, publish video) generate events.
- **Queries** – Read‑optimised databases (Elasticsearch, Cassandra, etc.) are populated by processing these events in near real‑time.

**Real‑world Example – YouTube Search:**

When video metadata changes, events are emitted. These events update search indexes (e.g., Elasticsearch) asynchronously, allowing fast and scalable search queries without impacting the write side.

---

## Saga Pattern

Distributed transactions across multiple microservices cannot rely on a single ACID transaction. The **Saga Pattern** breaks a transaction into a series of local transactions, each with a **compensating action** that can undo its effect if a later step fails.

**Example – Video Upload Saga:**

1. **Reserve storage**
2. **Store the file**
3. **Create metadata**

If step 2 fails, the compensating action for step 1 is triggered: **release storage**.

**Orchestration with Tools like Netflix Conductor:**

Netflix’s Conductor provides an orchestration engine that manages the execution and compensation logic of sagas across microservices, ensuring reliability and consistency without distributed locks.

---

## Putting It All Together

By combining **Event Sourcing**, **CQRS**, and **Saga**, systems can:

- Scale horizontally by separating concerns.
- Maintain high availability and resilience.
- Provide rich audit logs and debugging capabilities.
- Support complex business processes that span multiple services.

These patterns are the backbone of many large‑scale platforms—from video streaming to e‑commerce—enabling them to handle millions of requests with confidence.

## NoSQL: Bigtable/Spanner and Cassandra

**Bigtable (Google’s)** – used by YouTube for metadata, comments, user history. It’s a wide-column store with sorted keys, designed for massive petabyte scale. Internally, it’s based on Log-Structured Merge (LSM) trees (like LevelDB, RocksDB). Writes go to a memtable, then flushed to SSTables. Compaction merges files. Reads merge from memtable + SSTables. Edge case: Write-heavy storms can cause many SSTables, slowing reads; compactions consume I/O. Careful throttling and monitoring.

**Spanner (Google’s globally distributed SQL-ish DB)** – used by YouTube for things that need external consistency across data centers (like video IDs, usernames). It uses atomic clocks and GPS (TrueTime) to give globally consistent transactions with an uncertainty window. That’s insane tech.

**Cassandra (Netflix)** – decentralized, masterless, partitioned by consistent hashing. Netflix uses Cassandra for viewing history, ratings, bookmarks. It’s great for high write throughput and multi-region. Edge case: a node goes down; hinted handoff stores writes temporarily, and read repair fixes inconsistencies. But you must tune consistency levels (QUORUM) to avoid stale reads. Netflix developed EVCache (memcached on top) to smooth out read performance.


# Elastic Search

```
Elasticsearch is a distributed, RESTful search and analytics engine built on Apache Lucene. It excels at storing, searching, and analyzing large volumes of data in near real‑time. It’s the core of the ELK Stack (Elasticsearch, Logstash, Kibana) and is widely used for log analytics, full‑text search, observability, and vector search for AI applications.
```

# HTTP Resumable Uploads

```
HTTP data transfers can encounter interruption due to reasons such as canceled requests or dropped connections. If the intended recipient can indicate how much of the data was processed prior to interruption, a sender can resume data transfer at that point instead of attempting to transfer all of the data again. HTTP range requests support this concept of resumable downloads from server to client. This document describes a mechanism that supports resumable uploads from client to server using HTTP.
```

# ZUUL API Gateway

![alt text](image.png)


- In this tutorial, we are mainly focused on the Zuul API gateway. We have so many API gateways are available. In Spring Cloud we have a Zuul API gateway. If you are working on AWS based environment then you will have different AWS API gateways. So you can use any of them.

## What is Eureka Server?

    Eureka Server is an application that holds information about all client-service applications. Every Microservice will register into the Eureka server and the Eureka server knows all the client applications running on each port and IP address. Eureka Server is also known as Discovery Server. With Netflix Eureka each client can simultaneously act as a server, to replicate its status to a connected peer. In other words, a client retrieves a list of all connected peers of a service registry and makes all further requests to any other services through a load-balancing algorithm.

## Zuul API Gateway

- Zuul Server is an API Gateway application. It handles all the requests and performs the dynamic routing of microservice applications. It is also known as Edge Server. Zuul is built to enable dynamic routing, monitoring, resiliency, and security. It can also route the requests to multiple Amazon Auto Scaling Groups.

- For Example, /api/products are mapped to the product service and /api/user is mapped to the user service. The Zuul Server dynamically routes the requests to the respective back-end application.


## How to use the Zuul API gateway in the Micro-Service Applications?

- So let’s say we have a registry server called Eureka Registry and we have different Microservice applications. MicroService1 and MicroService2. And those are deployed in the different hosts and the ports are different. And also we have a UI service that is registered in Netflix Eureka. And now all the Microservices are Registered in the Eureka Registry server.


![alt text](image-1.png)



- Now let’s say we need to communicate from the UI service to the Micro-service here the security is very risky here. In this kind of scenario, we need to provide security for all the microservices. Let’s say we have 100 microservices and if you want to provide security for all these 100 microservices under auth2 and JWT, it is going to risky. We need to write the same code for all these 100 microservices and we need to do the authorization and authentication. That is not Good.

- In real-time what we do is, all the microservices will be deployed in a private network so that these microservices will not expose to the outside. Nobody can access it. Then how we are going to provide the security here?.

- Then the Zuul API gateway comes into the picture.

![alt text](image-2.png)


- Let’s say we have Micro Service Registry and we have multiple microservices. All the microservices are registered in the Netflix Eureka and also we have an API gateway which is one of the microservice and it is a part of the Spring Cloud. So once all the services are registered all the services are available in the Netflix Eureka Registry. Now the MicroService1 and MicroService2 are in a private network and they are not exposed outside. Now how we are going to communicate Web UI Micro Service to MicroService1?

- Whenever any request from the User comes, to any UI service the request will go to the Zuul API Gateway. Zuul will route all the requests to the corresponding Micro Service. So here instead of exposing all the Micro Services to the UI, UI needs to send the request to the API Gateway and Gateway should provide security(Authorization and the Authentication) and the routes. Here we need to filter all the Requests(Users) where this particular user is authorized or not and if Authorized allow the route to the User to particular Micro Service.   


# Canary Deployments
- A canary deployment is a risk-averse software release strategy where a new application version is rolled out to a small subset of users before being deployed to the entire production environment

- The new version is deployed alongside the old, stable version. A load balancer routes a tiny percentage (e.g., 2%) of user traffic to the canary

- If the canary is stable, traffic is incrementally shifted in phases (e.g., to 25%, 50%, and 75%)

# Sharding:

- Database sharding is a horizontal scaling technique that involves splitting a single, large dataset into smaller, independent chunks called shards and distributing them across multiple separate database servers