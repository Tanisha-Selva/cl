import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://alice:your_password@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority")

print("Connecting to MongoDB Atlas Cloud Database...")

try:
    client = MongoClient(MONGO_URI)
    
    # Select Database and Collection
    db = client['student_db']
    records = db['student_table']

    print("Connected to MongoDB Atlas successfully!
")

    # Clear previous test data (Optional cleanup for fresh run)
    records.delete_many({})

    # -------------------------------------------------------------------
    # 1) INSERT ONE RECORD
    # -------------------------------------------------------------------
    print("--- [1] Insert One Record ---")
    doc_one = {
        "name": "Rajesh",
        "mail": "rajesh@gmail.com",
        "phone": "9876543210"
    }
    insert_one_res = records.insert_one(doc_one)
    print("Inserted One Record ID:", insert_one_res.inserted_id)

    # -------------------------------------------------------------------
    # 2) INSERT MANY RECORDS
    # -------------------------------------------------------------------
    print("
--- [2] Insert Many Records ---")
    docs_many = [
        {"name": "Suresh", "mail": "suresh@gmail.com", "phone": "8876543210"},
        {"name": "Ramesh", "mail": "ramesh@gmail.com", "phone": "7876543210"}
    ]
    insert_many_res = records.insert_many(docs_many)
    print("Inserted Many Records IDs:", insert_many_res.inserted_ids)

    # -------------------------------------------------------------------
    # 3) LIST ALL THE RECORDS
    # -------------------------------------------------------------------
    print("
--- [3] List All Records ---")
    for doc in records.find():
        print(doc)

    # -------------------------------------------------------------------
    # 4) RETRIEVE PARTICULAR RECORD
    # -------------------------------------------------------------------
    print("
--- [4] Retrieve Particular Record (Name = Rajesh) ---")
    particular_record = records.find_one({"name": "Rajesh"})
    print(particular_record)

    # -------------------------------------------------------------------
    # 5) UPDATE THE RECORD
    # -------------------------------------------------------------------
    print("
--- [5] Update Record (Updating Rajesh's phone number) ---")
    records.update_one(
        {"name": "Rajesh"},
        {"$set": {"phone": "9999999999"}}
    )
    print("Record updated successfully!")
    print("Updated Record:", records.find_one({"name": "Rajesh"}))

    # -------------------------------------------------------------------
    # 6) DELETE THE RECORD
    # -------------------------------------------------------------------
    print("
--- [6] Delete Record (Deleting Suresh) ---")
    records.delete_one({"name": "Suresh"})
    print("Record deleted successfully!")

    # -------------------------------------------------------------------
    # FINAL DATABASE STATE
    # -------------------------------------------------------------------
    print("
--- Final Records in Database ---")
    for doc in records.find():
        print(doc)

except Exception as e:
    print("Error connecting or executing MongoDB queries:", e)
