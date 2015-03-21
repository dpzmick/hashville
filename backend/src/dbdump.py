import csv
from pymongo import MongoClient

data_info = [
    {
        'fname': '/Users/dz0004455/programming/hashville/backend/raw_data/Art_in_Public_Places.csv',
        'desc_fields': {'title': 0, 'last_name': 1, 'first_name': 2, 'medium': 4, 'type_': 5, 'desc': 6},
        'lat_field': 7,
        'long_field': 8,
        'db_collection': 'public_art'
    },
    {
        'fname': '/Users/dz0004455/programming/hashville/backend/raw_data/Historic_Markers.csv',
        'desc_fields': {'title': 0},
        'lat_field': 4,
        'long_field': 5,
        'db_collection': 'historical_markers'
    },
    {
        'fname': '/Users/dz0004455/programming/hashville/backend/raw_data/Metro_Public_Art_Collection.csv',
        'desc_fields': {'title': 0, 'last_name': 1, 'first_name': 2, 'medium': 4, 'desc': 6},
        'lat_field': 8,
        'long_field': 9,
        'db_collection': 'metro_public_art'
    }
]

# connect to the database
client = MongoClient()
#db = client.test_database # TODO change for real export
db = client.place_data

for dtype in data_info:
    print "Getting data for %s" % dtype['fname']
    dtype_collection = db[dtype['db_collection']] # get the collection

    with open(dtype['fname'], 'rb') as csvfile:
        read = csv.reader(csvfile, delimiter=',')
        for row in list(read)[1:]: # assume everyone has a header
            datum = {
                    'desc': {},
                    'lat' : row[dtype['lat_field']],
                    'long': row[dtype['long_field']]
            }

            # build description
            for field, index in dtype['desc_fields'].iteritems():
                datum['desc'][field] = row[index]

            # push to database
            dtype_collection.insert(datum)

