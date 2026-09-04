const API_URL = 'https://kitek.ktkv.dev/static/spotify.json';

const tracksContainer = document.getElementById('tracksContainer');
const totalTracksEl = document.getElementById('totalTracks');
const totalDurationEl = document.getElementById('totalDuration');
const avgPopularityEl = document.getElementById('avgPopularity');
const topArtistEl = document.getElementById('topArtist');

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatTotalDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function renderTracks(tracks) {
    if (!tracks || tracks.length === 0) {
        tracksContainer.innerHTML = `
            <div class="loading">
                <p>Нет треков в плейлисте</p>
            </div>
        `;
        return;
    }

    const tracksToShow = tracks.slice(0, 20);
    
    const html = tracksToShow.map((track, index) => {
        const name = track.name || 'Без названия';
        const artists = track.artists ? track.artists.join(', ') : 'Неизвестный артист';
        const album = track.album || '—';
        const image = track.image || 'https://via.placeholder.com/48/ecf0f1/7f8c8d?text=🎵';
        const duration = track.duration_ms ? formatDuration(Math.floor(track.duration_ms / 1000)) : '0:00';
        const popularity = track.popularity || 0;

        return `
            <li class="track-item">
                <div class="track-number">${index + 1}</div>
                <div class="track-main">
                    <img
                        src="${image}"
                        alt="${name}"
                        class="album-art"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/48/ecf0f1/7f8c8d?text=🎵'"
                    />
                    <div class="track-info">
                        <div class="track-name">${name}</div>
                        <div class="track-artists">${artists}</div>
                        <div class="track-album">${album}</div>
                    </div>
                </div>
                <div class="track-meta">
                    <div class="duration">${duration}</div>
                    <div class="popularity">♪ ${popularity}</div>
                </div>
            </li>
        `;
    }).join('');

    tracksContainer.innerHTML = html;
}

function updateStats(tracks) {
    const total = tracks.length;
    totalTracksEl.textContent = total;

    const totalSeconds = tracks.reduce((sum, track) => {
        return sum + (track.duration_ms ? Math.floor(track.duration_ms / 1000) : 0);
    }, 0);
    totalDurationEl.textContent = formatTotalDuration(totalSeconds);

    const avgPopularity = Math.round(
        tracks.reduce((sum, track) => sum + (track.popularity || 0), 0) / total
    );
    avgPopularityEl.textContent = avgPopularity;

    const artistCount = {};
    tracks.forEach(track => {
        if (track.artists && track.artists.length > 0) {
            track.artists.forEach(artist => {
                artistCount[artist] = (artistCount[artist] || 0) + 1;
            });
        }
    });

    let topArtist = '—';
    let maxCount = 0;
    for (const [artist, count] of Object.entries(artistCount)) {
        if (count > maxCount) {
            maxCount = count;
            topArtist = artist;
        }
    }
    topArtistEl.textContent = topArtist;
}

function showLoading() {
    tracksContainer.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p style="margin-top: 12px;">Загрузка треков...</p>
        </div>
    `;
}

function showError(message) {
    tracksContainer.innerHTML = `
        <div class="loading">
            <p style="font-size: 40px; margin-bottom: 12px;">⚠️</p>
            <p>${message}</p>
            <button onclick="fetchData()" style="margin-top: 16px; padding: 8px 16px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Попробовать снова
            </button>
        </div>
    `;
}

async function fetchData() {
    showLoading();

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !Array.isArray(data)) {
            throw new Error('Некорректный формат данных');
        }

        updateStats(data);
        renderTracks(data);

    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showError('Не удалось загрузить треки. Пожалуйста, попробуйте позже.');
    }
}
=
document.addEventListener('DOMContentLoaded', fetchData);

window.fetchData = fetchData;
