# Generate access code

scope="user-top-read"
redirect_uri="https://vahor.fr"

echo "Using client_id: $SPOTIFY_CLIENT_ID"

url="https://accounts.spotify.com/authorize?client_id=$SPOTIFY_CLIENT_ID&response_type=code&redirect_uri=$redirect_uri&scope=$scope"

echo "Go to this URL: $url"
echo "Paste the code here:"
read code

echo "Using code: $code"

res=$(curl -s -d client_id=$SPOTIFY_CLIENT_ID -d client_secret=$SPOTIFY_CLIENT_SECRET -d grant_type=authorization_code -d code=$code -d redirect_uri=$redirect_uri https://accounts.spotify.com/api/token)

echo $res | jq
