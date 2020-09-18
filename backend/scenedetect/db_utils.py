import sqlite3
import os

def create_db(db_path = "", db_name = "output.db"):
	conn = open_db_connection(db_path, db_name)

	#if test.db previously exists, removing all records from it and starting anew
	try:
		conn.execute('''DROP TABLE IF EXISTS SCENE_DETECTION;''')
		conn.commit()
	except sqlite3.OperationalError:
		pass

	# creating the scene_detection table
	conn.execute('''CREATE TABLE SCENE_DETECTION		
			(NAME TEXT PRIMARY KEY NOT NULL,
			ENVIRONMENT TEXT NOT NULL,
			CATEGORIES TEXT NOT NULL,
			ATTRIBUTES TEXT NOT NULL);''')

	# executing the transaction and in the end closing it
	commit_and_close_connect(conn)

def open_db_connection(db_path = "", db_name = "output.db"):
	conn = sqlite3.connect(os.path.join(db_path, db_name))
	return conn

def commit_and_close_connect(conn):
	# executing the transaction and in the end closing it
	conn.commit()
	conn.close()