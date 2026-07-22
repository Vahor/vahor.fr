REDIRECT_URI="https://vahor.fr"
SCOPE="user-top-read"

open "https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}"

read -p "Enter the code here: " CODE

curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d grant_type=authorization_code \
  -d code="${CODE}" \
  -d redirect_uri="${REDIRECT_URI}" \
  -d client_id="${SPOTIFY_CLIENT_ID}" \
  -d client_secret="${SPOTIFY_CLIENT_SECRET}" | jq .
