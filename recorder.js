const { spawn } = require('child_process');
const { existsSync, mkdirSync } = require('fs');
const { SingleBar } = require('cli-progress');

function recordAndPreviewStream(link, outputPath, duration) {
    try {
        const totalSeconds = convertDurationToSeconds(duration);
        const progressBar = new SingleBar({
            format: ' Recording Progress [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total}s',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        });

        progressBar.start(totalSeconds, 0);

        const recordCommand = `ffmpeg -i "${link}" -t ${duration} -c copy "${outputPath}"`;
        const recordProcess = spawn(recordCommand, {
            shell: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        recordProcess.on('error', (error) => {
            console.error(`🚫  Error executing FFmpeg command: ${error.message}`);
        });

        let startTime = Date.now(); // Record start time for ETA calculation

        recordProcess.stderr.on('data', (data) => {
            const str = data.toString();
            const matches = str.match(/time=(\d+:\d+:\d+)/);
            if (matches) {
                const currentTime = matches[1];
                const [hours, minutes, seconds] = currentTime.split(':').map(Number);
                const elapsedTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

                // Update the progress bar
                progressBar.update(elapsedTimeInSeconds);

                // Calculate and display ETA
                const elapsedTime = Date.now() - startTime;
                const estimatedTotalTime = (elapsedTime / elapsedTimeInSeconds) * totalSeconds;
                const eta = new Date(Date.now() + estimatedTotalTime);
                progressBar.update(elapsedTimeInSeconds, {
                    eta_formatted: formatETA(eta)
                });
            }
        });

        recordProcess.on('exit', (code) => {
            progressBar.stop();
            if (code !== 0) {
                console.error(`🚫  Error FFmpeg process exited with code ${code}`);
                console.log('');
            } else {
                console.log(`👍  Recording of the stream completed successfully`);
                console.log(`🎁  Saving Video file to ${outputPath}...`);

                // Clear console.log messages after 5 seconds
                setTimeout(() => {
                    console.clear();
                }, 5000);
            }
        });
    } catch (error) {
        console.error("🚫  An error occurred:", error);
    }
}
// Rest of your code...


function formatETA(eta) {
    const hours = String(eta.getHours()).padStart(2, '0');
    const minutes = String(eta.getMinutes()).padStart(2, '0');
    const seconds = String(eta.getSeconds()).padStart(2, '0');
    return `${hours} : ${minutes} : ${seconds}`;
}

function convertDurationToSeconds(duration) {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

//--if you record multiple stream you need smooth stable connection--//
const streamLinks = [
    "https://edge2-fld.livemediahost.com/cam_obs/katebleare-flu_v1/tracks-v1a2/mono.m3u8?token=eyJpdiI6IkpJZGJGcHZwSlJZaHltenhhTXpJZ2c9PSIsInZhbHVlIjoiaFRPMzBuYkpuXC9uWmt1Mm90RGFPM1E9PSIsIm1hYyI6IjI3ZjgzYmU3ZWE0ZjRkMmY2Nzk3ZjNhNDgwZGYwMWE2OGZiY2U3ZWE0NzhhNjU2ZDFjZWUxNjdiMWUxNjI2NTEifQ%3D%3D",
    "https://edge8-nrt.live.mmcdn.com/live-edge/amlst:mariemelons-sd-634dd198f0149039e51bab6e09eebd3eb22ab40939801df473a64dd623c75ad2_trns_h264/chunklist_w274717369_b1148000_t64RlBTOjMwLjA=.m3u8",
//     "https://edge7-nrt.live.mmcdn.com/live-edge/amlst:jackraian-sd-a1770a965f00e560b72aa457c573eed05aad1a80a3c3f3fa1268ae1a7bf9a27c_trns_h264/chunklist_w1631924966_b1848000_t64RlBTOjMwLjA=.m3u8",
// "https://edge3-sof.live.mmcdn.com/live-edge/amlst:latinbaby_666-sd-8f31bf49cbe791e03490d38e280724b72964ea054761e7c9dcabb32ea64cb144_trns_h264/chunklist_w816940790_b1148000_t64RlBTOjMwLjA=.m3u8",
// "https://edge2-sof.live.mmcdn.com/live-edge/amlst:goldteachers-sd-ef619d6305032c98280f52eb813ecc0fb5719972d7a564c8550a42f534781695_trns_h264/chunklist_w1148211155_b1148000_t64RlBTOjMwLjA=.m3u8",
    // "https://edge3-nrt.live.mmcdn.com/live-edge/amlst:iam_eli-sd-44009047db59a7aca6c76cdd7a4b12c6d531feb1e54a076597108093a5b48342_trns_h264/chunklist_w999498287_b3096000_t64RlBTOjMwLjA=.m3u8",
    // "https://ev-h.phncdn.com/hls/videos/202403/11/449402991/,1080P_4000K,720P_4000K,480P_2000K,240P_1000K,_449402991.mp4",
    // "https://edge1-nrt.live.mmcdn.com/live-hls/amlst:lindabluee-sd-88efb483b84bd208e008ed408efbd74d2f70b749bd61eb3567bc8047a8927cbe_trns_h264/chunklist_w1269132898_b1148000_t64RlBTOjMwLjA=.m3u8",
    // "https://edge14-nrt.live.mmcdn.com/live-hls/amlst:kittycaitlin-sd-da18f6d88c37bf16e37cf52106a769d5c4f47b1d0877c435155154343fc80d3f_trns_h264/chunklist_w1248798926_b1148000_t64RlBTOjMwLjA=.m3u8", //add stream link
    // "https://edge15-nrt.live.mmcdn.com/live-hls/amlst:calehot98-sd-2295720802de25ee7cb932d05a7df30dc5937f0dbd7e186ea430bfdcabf47c3c_trns_h264/chunklist_w535746241_b3096000_t64RlBTOjMwLjA=.m3u8",
    // "https://edge7-nrt.live.mmcdn.com/live-hls/amlst:emyii-sd-9c1bf75050f0851d15ca5698516d9aee8524ac02957ed019c829d2d3a9ff11c2_trns_h264/chunklist_w388897758_b3096000_t64RlBTOjMwLjA=.m3u8",
    // "https://edge8-nrt.live.mmcdn.com/live-hls/amlst:nymphlovesdick-sd-cbf3feb1d52e7e4f7dc791ac282db7815fd397173d07727e779e257ce72c5b44_trns_h264/chunklist_w1408674818_b3096000_t64RlBTOjI5Ljk3.m3u8",
    // "https://edge2-nrt.live.mmcdn.com/live-hls/amlst:lu_blu-sd-9e30998f8e11cc7b15ae99e4c85f447a0d429b8b583331deb7ea85369523d160_trns_h264/chunklist_w45975652_b1148000_t64RlBTOjMwLjA=.m3u8",
    // // "https://edge18-nrt.live.mmcdn.com/live-hls/amlst:mashayang-sd-c1c82afb14cd8de0e256adb8bade2d7fd102dcb29dec9b6cedb53a5433f740b9_trns_h264/chunklist_w1836190219_b1148000_t64RlBTOjMwLjA=.m3u8",
    // "https://edge13-nrt.live.mmcdn.com/live-hls/amlst:little_izzi-sd-5026936550860dc17cf4a7f0965d17e0aeda9472f7f1e410ffed8c09b9960f7f_trns_h264/chunklist_w1439515971_b3096000_t64RlBTOjMwLjA=.m3u8",
    // // "https://edge15-nrt.live.mmcdn.com/live-hls/amlst:ourwhitesecret-sd-d875ee34401be01aa63ebae7e75ccc87939dc637f3d765839fbb4ec5dbc8472d_trns_h264/chunklist_w583836228_b3096000_t64RlBTOjMwLjA=.m3u8",
    // "https://edge4-nrt.live.mmcdn.com/live-hls/amlst:skinny4danger-sd-d3cb8b6d2b0408d35203325946b347f21ca138cf3c092e7673de0c031842d669_trns_h264/chunklist_w570774693_b1148000_t64RlBTOjMwLjA=.m3u8",
    
    // "https://edge14-nrt.live.mmcdn.com/live-hls/amlst:like_pie-sd-aa8c33e9c1f9d21c677a7ce75da75fe8ebbf87dff819cc50fd6b91be444ee42d_trns_h264/chunklist_w765924940_b1148000_t64RlBTOjI1LjA=.m3u8",
    // "https://edge13-nrt.live.mmcdn.com/live-hls/amlst:skinny4danger-sd-d3cb8b6d2b0408d35203325946b347f21ca138cf3c092e7673de0c031842d669_trns_h264/chunklist_w1853956940_b1148000_t64RlBTOjMwLjA=.m3u8",
    // "https://edge9-nrt.live.mmcdn.com/live-hls/amlst:excitease-sd-d48cc6cbda7fddc9cef6a8b15b1849e097035d45dee5a3483fa80b510c9e7f45_trns_h264/chunklist_w662893342_b1148000_t64RlBTOjI1LjA=.m3u8",
    // "https://edge10-nrt.live.mmcdn.com/live-hls/amlst:euphoriaparty-sd-f748ef6f6339d8e50cfed828a7bd741b28b307e1e316750c826957c3c171a49b_trns_h264/chunklist_w1098925731_b1038000_t64RlBTOjI5Ljk3.m3u8",
    // "https://edge2-sof.live.mmcdn.com/live-hls/amlst:suzaneparisi_-sd-d400303029328ae41ce3a478f0f85b97df4ecc038a95fdbb3dddee7ad5473958_trns_h264/chunklist_w367088296_b1148000_t64RlBTOjMwLjA=.m3u8",
    // Add more stream links as needed--
];

// define your own paths if you want
const streamers = [
    "KateBleare",
    "mariemelons",
//     "jackraian",
// "latinbaby_666",
// "goldteachers",
    // "iam_eli",
    // "lindabluee",
    // "kittycaitlin",
    // "calehot98",
    // "emyii",
    // // "nymphlovesdick",
    // "lu_blu",
    // // "mashayang",
    // "little_izzi",
    // // "ourwhitesecret",
    // "skinny4danger",
    // "like_pie",
    // // "skinny4danger",
    // // "excitease",
    // // "euphoriaparty",
    // "suzaneparisi_",
    // Add more streamer names as needed--
];

const Format = '.mp4';
//--If Your Using Following Path You Must Need To Create [ Stream-DL ]Folder in [ C:\Users\kesitha\Videos\ ]
const RecFolder = `C:\\Users\\kesitha\\Videos\\Stream-DL`;


let durations = [
    "00:01:30",
];

// If only one duration is defined, assign it to all streams
if (durations.length === 1) {
    durations = Array(streamLinks.length).fill(durations[0]);
}

// Ensure the directory exists, create it if it doesn't
if (!existsSync(RecFolder)) {
    mkdirSync(RecFolder, { recursive: true });
}

//--Iterate over each stream and call the recordAndPreviewStream function--//
for (let i = 0; i < streamLinks.length; i++) {
    const streamer = streamers[i];
    const outputPath = `${RecFolder}\\${streamer}\\${streamer}${Format}`;
    const streamFolder = `${RecFolder}\\${streamer}`;
    
    // Ensure the streamer's folder exists, create it if it doesn't
    if (!existsSync(streamFolder)) {
        mkdirSync(streamFolder, { recursive: true });
    }

    if (existsSync(outputPath)) {
        let counter = 2;
        let newOutputPath;
        do {
            newOutputPath = `${RecFolder}\\${streamer}\\${streamer}_${counter}${Format}`;
            counter++;
        } while (existsSync(newOutputPath));
        recordAndPreviewStream(streamLinks[i], newOutputPath, durations[i]);
    } else {
        recordAndPreviewStream(streamLinks[i], outputPath, durations[i]);
    }
}
