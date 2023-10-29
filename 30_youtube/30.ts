import { mapYouTubeVideos} from "./helpers.ts";
import convert from 'xml-js';
import * as fs from "fs";

const channels = ["UC_MIaHmSkt9JHNZfQ_gUmrg", /* overment */ "UCTTZqMWBvLsUYqYwKTdjvkw", /* chrobok */ "UCRHXKLPXE-hYh0biKr2DGIg" /* unknow */];
const fetchChannel = async (channelId: string) => {
    const response = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId);
    const xml = await response.text();
    const json = JSON.parse(convert.xml2json(xml, {compact: false, spaces: 4}));
    return mapYouTubeVideos(json, channelId);
}

const fetchTranscription = async (videoId: string) => {
    const response = await fetch('https://hook.eu1.make.com/WEBHOOK_ID?video_id=' + videoId, {
        headers: {'Content-Type': 'application/json'}
    });
    try {
        return await response.json();
    } catch {
        return {data: null, message: "No transcription found"}
    }
}

const videos = await Promise.all(channels.map(fetchChannel));
const latest = videos.map((channelVideos) => channelVideos[0]);
const transcripts = await Promise.all(latest.map(async (video) => {
    return {
        ...video,
        transcription: await fetchTranscription(video.id)
    }
}));
console.log(transcripts)
fs.writeFileSync('30_youtube/videos.json', JSON.stringify(transcripts));