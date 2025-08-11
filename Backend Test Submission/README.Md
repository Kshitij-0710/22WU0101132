
## install all the required packages listed in the requirements.txt file.

pip install -r requirements.txt

## Set Up the Database

this step creates the database file and the necessary tables for your models
python manage.py makemigrations
run migrate to apply those changes and create the tables:
python manage.py migrate


Run the Server
start the Django server.
python manage.py runserver

Your backend is now fully set up and running.