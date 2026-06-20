window.adsbygoogle = window.adsbygoogle || [];
const adBreak = adConfig = function (o) {
    adsbygoogle.push(o);
}

adConfig({
    sound: 'on',
    preloadAdBreaks: 'on',
});

let interstitialCounter = 0;
let showRewardedFn = null;

function initSdk() {
    console.log('"Init SDK" Called');

    setTimeout(loadRewarded, 500);
}

function showInterstitial() {
    if (++interstitialCounter === 1) {
        console.log("Interstitial ads skipped this time");
        return;
    }

    adBreak({
        type: 'next',
        name: 'restart-game',
        beforeAd: sendMsgPauseGameBeforeAds,
        adBreakDone: (placementInfo) => {
            console.log("Interstitial adBreak status: " + placementInfo.breakStatus);
            sendMsgResumeGameAfterAds()
        },
    });
}

function loadRewarded() {
    adBreak({
        type: 'reward', // ad shows at the start of the next level
        name: 'extra-life',
        beforeAd: sendMsgPauseGameBeforeAds,
        beforeReward: (showAdFn) => {
            showRewardedFn = showAdFn;
            sendMsgRewardedAdsLoaded();
        },
        adDismissed: () => {
            setTimeout(loadRewarded, 500);
            sendMsgRewardedAdsDismissed();
        },
        adViewed: () => {
            setTimeout(loadRewarded, 500);
            sendMsgRewardSuccessful();
        },
        adBreakDone: (placementInfo) => {
            console.log("Reward adBreak status: " + placementInfo.breakStatus);

            if (placementInfo.breakStatus === 'frequencyCapped') {
                console.log('Rewarded frequency capped, will try to load again in 5 seconds.');
                setTimeout(loadRewarded, 5000);
            }

            sendMsgResumeGameAfterAds()
        }
    });
}

function showRewarded() {
    if (showRewardedFn) {
        showRewardedFn();
    } else {
        console.log("Rewarded not loaded yet, maybe adblocker or did you call loadRewarded?");
    }
}

function sendMsgRewardedAdsLoaded() {
    console.info("SendMessageToUnityInstance: Rewarded ready");
    myGameInstance.SendMessage('RHMAdsManager', 'isRewardedAdsLoaded');
}

function sendMsgRewardedAdsDismissed() {
    console.info("SendMessageToUnityInstance: Reward dismissed")
    myGameInstance.SendMessage('RHMAdsManager', 'RewardedAdsFailed');
    refocusCanvas();
}

function sendMsgRewardSuccessful() {
    console.info("SendMessageToUnityInstance: Reward successful")
    myGameInstance.SendMessage('RHMAdsManager', 'RewardedAdsSuccessfull');
    refocusCanvas();
}

function sendMsgPauseGameBeforeAds() {
    console.info("SendMessageToUnityInstance: Pause game before ads");
    myGameInstance.SendMessage('RHMAdsManager', 'pauseGame');
}

function sendMsgResumeGameAfterAds() {
    console.info("SendMessageToUnityInstance: Resume game after ads");
    myGameInstance.SendMessage('RHMAdsManager', 'resumeGame');
    refocusCanvas();
}

function refocusCanvas() {
    if (!canvas.hasAttribute('tabIndex')) {
        canvas.setAttribute('tabIndex', '0');
    }
    canvas.focus();
}
