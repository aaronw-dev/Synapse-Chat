import requests
from PIL import Image
import io


def generateavatar(apikey, name):
    querystring = {
        "api_key": apikey,
        "name": name,
        "image_size": "512",
        "image_format": "png",
        "font_size": "1",
        "char_limit": "2",
        "background_color": "0F0F0F",
        "font_color": "A9DCFD",
        "is_rounded": "true",
        "is_bold": "true"
    }
    response = requests.request(
        "GET", "https://avatars.abstractapi.com/v1", params=querystring)
    image = Image.open(io.BytesIO(response.content))
    return image
