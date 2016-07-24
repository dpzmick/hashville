# Hashville (working title)


## A Nashville travel assistant

I don't think the DB works but w/e something does.

In order to run locally.

1. Run ``` node backend/build/app.js ```
2. Run ``` python -m "SimpleHTTPServer" ```
3. Initialize the database with ``` python backend/src/dbdump.py ```
	- make sure you change the paths in dbdump.py to the paths where the .csv files are beforehand
4. Open your browser to whichever port your python server is running.

This might also be helpful.
http://flowtype.org/docs/running.html#using-the-in-browser-transform
