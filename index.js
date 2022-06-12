//---------------------------💔🚬 Zer0Power 💔🚬---------------------------//
//Import Packages 

const cors = require("cors");
const axios = require('axios');
const express = require("express");
const bodyParser = require("body-parser");
const { json } = require("body-parser");

const app = express();
//---------------------------💔🚬 Zer0Power 💔🚬---------------------------//

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());

//---------------------------💔🚬 Zer0Power 💔🚬---------------------------//

app.listen(2000, () => {
    console.log('[📶]Server Is Running Properly ....\n[ℹ️]Port : 2000');
});

app.get('/CheckPlayer',(req,res) =>{

    const playerid = req.query.gameplayerid

    async function GetFaceitID() {
        const config = {
            method: 'get',
            url: `https://open.faceit.com/data/v4/players?game=csgo&game_player_id=${playerid}`,
            headers: {'Authorization': 'Bearer 390bc3bc-24a3-4aa8-8c92-5005ca3fc638'}
        }
        let faceitdata = await axios(config).catch((reason)=> {
            if (reason.response.status === 400) {
              res.status(404).json({Status:"faceit account not found"})
            }
          })
        if(!faceitdata){res.status(404).json({Status:"faceit account not found"});
        }else{
            return faceitdata.data;
        }
        
    }



    async function GetPlayerHubs(){
        const playerdata = await GetFaceitID()
        if(!playerdata){return}
        const faceitid = playerdata.player_id
        const config = {
            method: 'get',
            url: `https://open.faceit.com/data/v4/players/${faceitid}/hubs?offset=0&limit=20`,
            headers: {'Authorization': 'Bearer 390bc3bc-24a3-4aa8-8c92-5005ca3fc638'}
        }
        let playerhubs = await axios(config)
        return JSON.stringify(playerhubs.data.items)
    }



    async function CheckMaxgaminghub(){
        const hubs = await GetPlayerHubs()
        if(!hubs){return}
        const playerdata = await GetFaceitID() 
        if(hubs.includes("998b6d53-57ab-4f8e-988c-319a72b1b557")){
            res.status(200).json({Status:"Player Found",Player:playerdata.nickname,Steam:playerdata.platforms.steam,Steamid:playerdata.steam_id_64})
        }else{
            res.status(400).json({Status:"Player Not Found"})
        }
    }

    if(playerid.length===17){CheckMaxgaminghub()}else{
        res.status(400).json({Error:"Invalid ID"})
        return;
    }

    
})