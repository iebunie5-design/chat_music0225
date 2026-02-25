const API_URL = 'https://www.googleapis.com/youtube/v3/search';

export function hasYoutubeKey() {
    return !!import.meta.env.VITE_YOUTUBE_API_KEY;
}

// YouTube Data API v3로 음악 검색
export async function searchYoutube(query) {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) return [];

    const params = new URLSearchParams({
        part: 'snippet',
        q: query + ' 음악',
        type: 'video',
        videoCategoryId: '10', // Music 카테고리
        maxResults: '6',
        key: apiKey,
    });

    const res = await fetch(`${API_URL}?${params}`);
    if (!res.ok) throw new Error('검색에 실패했습니다');

    const data = await res.json();
    return data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        thumbnail: item.snippet.thumbnails.medium.url,
        channel: item.snippet.channelTitle,
    }));
}
