const request = require("supertest");
const app = require("../src/app");
const Todo = require("../src/models/todo.model");
const { connectTestDB, closeTestDB, clearTestDB } = require("./setup");

beforeAll(async () => {
	await connectTestDB();
});

afterEach(async () => {
	await clearTestDB();
});

afterAll(async () => {
	await closeTestDB();
});

describe("POST /api/todos", () => {
	it("creates a todo with valid data", async () => {
		const res = await request(app)
			.post("/api/todos")
			.send({
				title: "Learn Node.js",
				description: "Study backend concepts",
			});

		expect(res.status).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.data.title).toBe("Learn Node.js");
		expect(res.body.data.completed).toBe(false);
	});

	it("rejects a request with no title", async () => {
		const res = await request(app)
			.post("/api/todos")
			.send({ description: "Missing title" });

		expect(res.status).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe("Title is required");
	});

	it("rejects a request with an empty/whitespace title", async () => {
		const res = await request(app).post("/api/todos").send({ title: "   " });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("Title cannot be empty");
	});
});

describe("GET /api/todos", () => {
	beforeEach(async () => {
		await Todo.create([
			{ title: "Learn Node.js", completed: false },
			{ title: "Learn React", completed: false },
			{ title: "Buy groceries", completed: true },
		]);
	});

	it("returns all todos when no query params are given", async () => {
		const res = await request(app).get("/api/todos");

		expect(res.status).toBe(200);
		expect(res.body.data).toHaveLength(3);
	});

	it("filters by search (case-insensitive)", async () => {
		const res = await request(app).get("/api/todos?search=NODE");

		expect(res.status).toBe(200);
		expect(res.body.data).toHaveLength(1);
		expect(res.body.data[0].title).toBe("Learn Node.js");
	});

	it("filters by completed=true", async () => {
		const res = await request(app).get("/api/todos?completed=true");

		expect(res.status).toBe(200);
		expect(res.body.data).toHaveLength(1);
		expect(res.body.data[0].title).toBe("Buy groceries");
	});

	it("combines search and completed filters", async () => {
		const res = await request(app).get(
			"/api/todos?search=learn&completed=false",
		);

		expect(res.status).toBe(200);
		expect(res.body.data).toHaveLength(2);
	});
});

describe("GET /api/todos/:id", () => {
	it("returns a single todo by id", async () => {
		const todo = await Todo.create({ title: "Learn Node.js" });

		const res = await request(app).get(`/api/todos/${todo._id}`);

		expect(res.status).toBe(200);
		expect(res.body.data.title).toBe("Learn Node.js");
	});

	it("returns 400 for an invalid id format", async () => {
		const res = await request(app).get("/api/todos/not-a-real-id");

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("Invalid todo ID");
	});

	it("returns 404 for a valid but non-existent id", async () => {
		const res = await request(app).get("/api/todos/507f1f77bcf86cd799439011");

		expect(res.status).toBe(404);
		expect(res.body.message).toBe("Todo not found");
	});
});

describe("PUT /api/todos/:id", () => {
	it("updates a todo", async () => {
		const todo = await Todo.create({ title: "Learn Node.js" });

		const res = await request(app)
			.put(`/api/todos/${todo._id}`)
			.send({ completed: true });

		expect(res.status).toBe(200);
		expect(res.body.data.completed).toBe(true);
		expect(res.body.data.title).toBe("Learn Node.js");
	});

	it("returns 404 when updating a non-existent todo", async () => {
		const res = await request(app)
			.put("/api/todos/507f1f77bcf86cd799439011")
			.send({ completed: true });

		expect(res.status).toBe(404);
	});

	it("rejects an update with an empty title", async () => {
		const todo = await Todo.create({ title: "Learn Node.js" });

		const res = await request(app)
			.put(`/api/todos/${todo._id}`)
			.send({ title: "" });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("Title cannot be empty");
	});
});

describe("DELETE /api/todos/:id", () => {
	it("deletes a todo", async () => {
		const todo = await Todo.create({ title: "Learn Node.js" });

		const res = await request(app).delete(`/api/todos/${todo._id}`);

		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);

		const found = await Todo.findById(todo._id);
		expect(found).toBeNull();
	});

	it("returns 404 when deleting a non-existent todo", async () => {
		const res = await request(app).delete(
			"/api/todos/507f1f77bcf86cd799439011",
		);

		expect(res.status).toBe(404);
	});
});
