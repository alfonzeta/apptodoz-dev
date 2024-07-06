// db.auth("admin", "admin");

db = db.getSiblingDB("admin");
print("MONGO_NOT_ROOT_PASSWORD:", process.env.MONGO_NOT_ROOT_PASSWORD);

db.createUser({
    user: "notroot",
    pwd: process.env.MONGO_NOT_ROOT_PASSWORD,
    roles: [
        { role: "readWrite", db: "todos" }
    ]
});