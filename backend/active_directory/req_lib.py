import requests
import json
from .configs import Configs
import urllib.parse


class ReqLib:

    def __init__(self):
        self.configs = Configs()

    '''
    This function allows a user to make a request to 
    a certain endpoint, with the BASE_URL of 
    https://api.princeton.edu:443/active-directory/1.0.2

    The parameters kwargs are keyword arguments. It
    symbolizes a variable number of arguments 
    '''

    def getJSON(self, endpoint, **kwargs):
        req = requests.get(
            self.configs.BASE_URL + endpoint,
            params=urllib.parse.urlencode(kwargs, quote_via=urllib.parse.quote),
            headers={
                "Authorization": "Bearer " + self.configs.ACCESS_TOKEN
            },
        )
        text = req.text

        # Check to see if the response failed due to invalid
        # credentials
        text = self._updateConfigs(text, endpoint, **kwargs)

        return json.loads(text)

    def _updateConfigs(self, text, endpoint, **kwargs):
        if text.startswith("<ams:fault"):
            self.configs._refreshToken(grant_type="client_credentials")

            # Redo the request with the new access token
            req = requests.get(
                self.configs.BASE_URL + endpoint,
                params=kwargs,
                headers={
                    "Authorization": "Bearer " + self.configs.ACCESS_TOKEN
                },
            )

            text = req.text

        return text

    def get_pu_status_from_net_id(self, net_id):
        """
        :param net_id: string
        :return: 'undergraduate', 'stf', 'graduate', or 'faculty' : string
        """
        try:
            req = self.getJSON(
                self.configs.USERS_FULL,
                uid=net_id,
            )[0]
            result = req['pustatus']
        except IndexError:
            result = "No status for net id"
        return result

    def get_info_for_tigerbook(self, net_id):
        """
        :param net_id: string
        :return: {net_id:} : dict
        """
        result = {}
        try:
            req = self.getJSON(
                self.configs.USERS_FULL,
                uid=net_id,
            )[0]
        except IndexError:
            return []

        result['net_id'] = req.get('uid', None)
        result['full_name'] = req.get('displayname', None)
        result['puid'] = req.get('universityid', None)
        email = req.get('mail', None)
        if email:
            result['email'] = email.lower()
        result['department'] = req.get('department', None)
        # result['pu_status'] = req.get('pustatus')
        return result
