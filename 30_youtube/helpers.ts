export interface IVideo {
    id: string
    title: string
    thumbnail: string
    description: string
    url: string
    channelId: string
    channel: string
}
export function mapYouTubeVideos(data: any, channelId: string): IVideo[] {
    // Find the 'entry' elements in the feed
    const entries = data.elements.find((el: any) => el.name === 'feed').elements.filter((el: any) => el.name === 'entry');

    // Map each 'entry' to a YouTube video object
    const videos = entries.map((entry: any) => {
        const elements = entry.elements;

        // Find the elements we need
        const titleElement = elements.find((el: any) => el.name === 'title');
        const linkElement = elements.find((el: any) => el.name === 'link');
        const mediaGroupElement = elements.find((el: any) => el.name === 'media:group');

        const id = elements.find((el: any) => el.name === "yt:videoId").elements[0].text;
        const title = titleElement.elements[0].text;
        const url = linkElement.attributes.href;
        const thumbnail = mediaGroupElement.elements.find((el: any) => el.name === 'media:thumbnail').attributes.url;
        const description = mediaGroupElement.elements.find((el: any) => el.name === 'media:description').elements[0].text;

        return { id, title, thumbnail, description, url, channelId, channel: `https://www.youtube.com/channel/${channelId}` };
    });

    return videos;
}