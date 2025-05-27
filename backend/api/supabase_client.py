from supabase import create_client
from decouple import config

url = config('DB_URL')
key = config('DB_KEY')
supabase = create_client(url, key)