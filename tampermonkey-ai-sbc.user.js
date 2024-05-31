// ==UserScript==
// @name         FIFA Auto SBC
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  automatically solve EAFC 24 SBCs using the currently available players in the club with the minimum cost
// @author       TitiroMonkey
// @match        https://www.easports.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @connect 	 www.futbin.com
// @connect      127.0.0.1

// ==/UserScript==

(function () {
    'use strict';

    //turn on console log
    let i = document.createElement('iframe');
    i.style.display = 'none';
    document.body.appendChild(i);
    window.console = i.contentWindow.console;

    //Add Locked Icon
    let styles = `
    ::-webkit-scrollbar {
              -webkit-appearance: none;
     }

     ::-webkit-scrollbar:vertical {
              width: 12px;
     }

     ::-webkit-scrollbar:horizontal {
              height: 12px;
     }

     ::-webkit-scrollbar-thumb {
              background-color: rgba(0, 0, 0, .5);
              border-radius: 10px;
              border: 2px solid #ffffff;
     }

     ::-webkit-scrollbar-track {
              border-radius: 10px;
              background-color: #ffffff;
     }
     .ut-tab-bar-item.sbcToolBarHover::after {
    content: "";
    background-color: #07f468;
    display: block;
    height: 2px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%
}
    .player.locked::before {
    font-family: 'UltimateTeam-Icons';
    position: absolute;
    content: '\\E07F';
    right: 8px;
    bottom: 2px;
    color: #00ff00;
    z-index: 2;
}
    .sbc-settings-container {
    overflow-y: scroll;
    display: flex;
    align-items: center;
    padding: 10px;
    }
    .sbc-settings {
    overflow-y: auto;
    //display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    box-shadow: 0 1rem 3em rgb(0 0 0 / 40%);
    background-color: #2a323d;
    width: 75%;
    justify-content: space-between;
    min-height:85%;
}
.sbc-settings-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
}
.sbc-settings-wrapper {
    background-color: #2a323d;
}
.sbc-settings-wrapper.tile {
    overflow: unset;
    border: 1px solid #556c95;
    border-radius: unset;
}
.sbc-settings-section {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    align-items: flex-end;
}
.sbc-settings-field {
    margin-top: 15px;
    width: 45%;
    padding: 10px;
}
   .ut-tab-bar-item.icon-sbcSettings:before {
      content: "\\E051";
   }
   .player.fixed::before {
    font-family: 'UltimateTeam-Icons';
    position: absolute;
    content: '\\E07F';
    right: 8px;
    bottom: 2px;
    color: #ff0000;
    z-index: 2;
}
   .item-price{
    width: auto !important;
    padding: 0 0.2rem;
    left: 50%;
    transform: translateX(-50%) !important;
    white-space: nowrap;
    background: #1e242a;
    border: 1px solid cornflowerblue;
    border-radius: 5px;
    position: absolute;
    z-index: 2;
    color: #fff;
    }
    .numCounter {
  display: none;
  height: 90px;
  line-height: 90px;
  text-shadow: 0 0 2px #fff;
  font-weight: bold;
  white-space: normal;
  font-size: 50px;
  position: absolute;
  bottom: 0;
  right:0px;
  transform: scale(0.5);
}

.numCounter > div {
  display: inline-block;
  vertical-align: top;
  height: 100%;

}

.numCounter > div > b {
  display: inline-block;
  width: 40px;
  height: 100%;
  margin: 0 0.1em;
  border-radius: 8px;
  text-align: center;
  background: white;
  overflow: hidden;
}

.numCounter > div > b::before {
  content: ' 0 1 2 3 4 5 6 7 8 9 ';
  display: block;
  word-break: break-all;
  -webkit-transition: 0.5s cubic-bezier(0.75, 0.15, 0.6, 1.15), text-shadow 150ms;
  transition: 0.5s cubic-bezier(0.75, 0.15, 0.6, 1.15), text-shadow 150ms;
}

.numCounter > div > b.blur {
  text-shadow: 2px 1px 3px rgba(0, 0, 0, 0.2),
               0 0.1em 2px rgba(255, 255, 255, 0.6),
               0 0.3em 3px rgba(255, 255, 255, 0.3),
               0 -0.1em 2px rgba(255, 255, 255, 0.6),
               0 -0.3em 3px rgba(255, 255, 255, 0.3);
}

.numCounter > div > b[data-value="1"]::before { margin-top: -90px; }
.numCounter > div > b[data-value="2"]::before { margin-top: -180px;}
.numCounter > div > b[data-value="3"]::before { margin-top: -270px;}
.numCounter > div > b[data-value="4"]::before { margin-top: -360px;}
.numCounter > div > b[data-value="5"]::before { margin-top: -450px;}
.numCounter > div > b[data-value="6"]::before { margin-top: -540px;}
.numCounter > div > b[data-value="7"]::before { margin-top: -630px;}
.numCounter > div > b[data-value="8"]::before { margin-top: -720px;}
.numCounter > div > b[data-value="9"]::before { margin-top: -810px;}

.numCounter {
  overflow: hidden;
  padding: .4em;
  text-align: center;

  border-radius: 16px;
  background: black;
}
.numCounter b {
  color: black;
}
`;
    let styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const getElement = (query, parent = document) => {
        return getRootElement(parent).querySelector(query);
    };
    const css = (elem, css) => {
        for (let key of Object.keys(css)) {
            getRootElement(elem).style[key] = css[key];
        }
        return elem;
    };
    const addClass = (elem, ...className) => {
        getRootElement(elem).classList.add(...className);
        return elem;
    };
    const removeClass = (elem, className) => {
        getRootElement(elem).classList.remove(className);
        return elem;
    };
    const getElementString = (node) => {
        let DIV = document.createElement('div');
        if ('outerHTML' in DIV) {
            return node.outerHTML;
        }
        let div = DIV.cloneNode();
        div.appendChild(node.cloneNode(true));
        return div.innerHTML;
    };
    const createElem = (tag, attrs, innerHtml) => {
        let elem = document.createElement(tag);
        elem.innerHTML = innerHtml;
        if (attrs) {
            for (let attr of Object.keys(attrs)) {
                if (!attrs[attr]) continue;
                elem.setAttribute(attr === 'className' ? 'class' : attr, attrs[attr]);
            }
        }
        return elem;
    };
    const getRootElement = (elem) => {
        if (elem.getRootElement) {
            return elem.getRootElement();
        }
        return elem;
    };
    const insertBefore = (newNode, existingNode) => {
        existingNode = getRootElement(existingNode);
        existingNode.parentNode.insertBefore(getRootElement(newNode), existingNode);
        return newNode;
    };
    const insertAfter = (newNode, existingNode) => {
        existingNode = getRootElement(existingNode);
        existingNode.parentNode.insertBefore(
            getRootElement(newNode),
            existingNode.nextSibling
        );
        return newNode;
    };
    const createButton = (id, label, callback, buttonClass = 'btn-standard') => {
        const innerSpan = createElem(
            'span',
            {
                className: 'button__text',
            },
            label
        );
        const button = createElem(
            'button',
            {
                className: buttonClass,
                id: id,
            },
            getElementString(innerSpan)
        );
        button.addEventListener('click', function () {
            callback();
        });
        button.addEventListener('mouseenter', () => {
            addClass(button, 'hover');
        });
        button.addEventListener('mouseleave', () => {
            removeClass(button, 'hover');
        });
        return button;
    };

    const DEFAULT_SEARCH_BATCH_SIZE = 91;
    const MILLIS_IN_SECOND = 1000;
    const wait = async (maxWaitTime = 2) => {
        const factor = Math.random();
        await new Promise((resolve) =>
            setTimeout(resolve, factor * maxWaitTime * MILLIS_IN_SECOND)
        );
    };
    const fetchPlayers = ({ count = Infinity, level, rarities, sort } = {}) => {
        return new Promise((resolve) => {
            services.Club.clubDao.resetStatsCache();
            services.Club.getStats();
            let offset = 0;
            const batchSize = DEFAULT_SEARCH_BATCH_SIZE;
            let result = [];
            const fetchPlayersInner = () => {
                searchClub({
                    count: batchSize,
                    level,
                    rarities,
                    offset,
                    sort,
                }).observe(undefined, async (sender, response) => {
                    result = [...response.response.items];

                    if (
                        result.length < count &&
                        Math.floor(response.status / 100) === 2 &&
                        !response.response.retrievedAll
                    ) {
                        offset += batchSize;

                        fetchPlayersInner();
                        return;
                    }
                    // TODO: Handle statusCodes
                    if (count) {
                        result = result.slice(0, count);
                    }
                    resolve(result);
                });
            };
            fetchPlayersInner();
        });
    };

    const searchClub = ({ count, level, rarities, offset, sort }) => {
        const searchCriteria = new UTBucketedItemSearchViewModel().searchCriteria;
        if (count) {
            searchCriteria.count = count;
        }
        if (level) {
            searchCriteria.level = level;
        }
        if (sort) {
            searchCriteria._sort = sort;
        }
        if (rarities) {
            searchCriteria.rarities = rarities;
        }
        if (offset) {
            searchCriteria.offset = offset;
        }
        return services.Club.search(searchCriteria);
    };
    let conceptPlayersCollected = false;
    const getConceptPlayers = async function () {

        return new Promise((resolve, reject) => {
            if (!getSettings(0, 0, 'collectConcepts')) {
                resolve([])
                return
            }
            const gatheredPlayers = [];
            const searchCriteria = new UTBucketedItemSearchViewModel().searchCriteria;
            searchCriteria.offset = 0;
            searchCriteria.count = DEFAULT_SEARCH_BATCH_SIZE;
            const getAllConceptPlayers = () => {
                searchConceptPlayers(searchCriteria).observe(
                    this,
                    async function (sender, response) {
                        gatheredPlayers.push(...response.response.items);
                        if (response.status !== 400 && !response.response.endOfList) {
                            searchCriteria.offset += searchCriteria.count;

                            //console.log('Concepts Retrieved',searchCriteria.offset)
                            getAllConceptPlayers();
                        } else {
                            conceptPlayersCollected = true;
                            showNotification(
                                'Collected All Concept Players',
                                UINotificationType.POSITIVE
                            );
                            resolve(gatheredPlayers);
                        }
                    }
                );
            };
            getAllConceptPlayers();

        });

    };
    ;
    const searchConceptPlayers = (searchCriteria) => {
        return services.Item.searchConceptItems(searchCriteria);
    };
    const sendUnassignedtoTeam = async () => {
        let ulist = await fetchUnassigned();
        return new Promise((resolve) => {


            services.Item.move(
                ulist.filter((l) => l.isMovable()),
                7
            ).observe(this, function (obs, event) { resolve(ulist) });
        })
    }
    const swapDuplicatestoTeam = async () => {
        let ulist = await fetchUnassigned();

        return new Promise((resolve) => {
            services.Item.move(
                ulist.filter((l) => l.isDuplicate() && l.untradeable),
                7
            ).observe(this, function (obs, event) {
                repositories.Item.unassigned.clear();
                repositories.Item.unassigned.reset();
                resolve(ulist)
            });
        })
    }

    const fetchUnassigned = () => {
        repositories.Item.unassigned.clear();
        repositories.Item.unassigned.reset();
        return new Promise((resolve) => {
            let result = [];
            services.Item.requestUnassignedItems().observe(
                undefined,
                async (sender, response) => {
                    result = [...response.response.items];
                    await fetchPlayerPrices(result)
                    resolve(result);
                }
            );
        });
    };
    const fetchDuplicateIds = () => {
        return new Promise((resolve) => {
            const result = [];
            services.Item.requestUnassignedItems().observe(
                undefined,
                async (sender, response) => {
                    const duplicates = [
                        ...response.response.items.filter((item) => item.duplicateId > 0),
                    ];
                    result.push(...duplicates.map((duplicate) => duplicate.duplicateId));
                    resolve(result);
                }
            );
        });
    };

    let apiUrl = 'http://127.0.0.1:8000/solve';

    let LOCKED_ITEMS_KEY = 'lockeditems';
    let cachedLockedItems;
    let isItemLocked = function (item) {
        let lockedItems = getLockedItems();
        return lockedItems.includes(item.id);
    };
    let lockItem = function (item) {
        let lockedItems = getLockedItems();
        lockedItems.push(item.id);
        saveLockedItems();
    };
    let unlockItem = function (item) {
        let lockedItems = getLockedItems();

        if (lockedItems.includes(item.id)) {
            const index = lockedItems.indexOf(item.id);
            if (index > -1) {
                lockedItems.splice(index, 1);
            }
        }
        saveLockedItems();
    };
    let getLockedItems = function () {
        if (cachedLockedItems) {
            return cachedLockedItems;
        }
        cachedLockedItems = [];
        let lockedItems = localStorage.getItem(LOCKED_ITEMS_KEY);
        if (lockedItems) {
            cachedLockedItems = JSON.parse(lockedItems);
        }
        return cachedLockedItems;
    };
    let lockedItemsCleanup = function (clubPlayerIds) {
        let lockedItems = getLockedItems();
        for (let _i = 0, _a = Array.from(lockedItems); _i < _a.length; _i++) {
            let lockedItem = _a[_i];
            if (!clubPlayerIds[lockedItem]) {
                const index = lockedItems.indexOf(lockedItem);
                if (index > -1) {
                    lockedItems.splice(index, 1);
                }
            }
        }
        saveLockedItems();
    };
    let saveLockedItems = function () {
        localStorage.setItem(LOCKED_ITEMS_KEY, JSON.stringify(cachedLockedItems));
    };

    let FIXED_ITEMS_KEY = 'fixeditems';
    let cachedFixedItems;
    let isItemFixed = function (item) {
        let fixedItems = getFixedItems();
        return fixedItems.includes(item.id);
    };
    let fixItem = function (item) {
        let fixedItems = getFixedItems();
        fixedItems.push(item.id);
        saveFixedItems();
    };
    let unfixItem = function (item) {
        let fixedItems = getFixedItems();

        if (fixedItems.includes(item.id)) {
            const index = fixedItems.indexOf(item.id);
            if (index > -1) {

                fixedItems.splice(index, 1);
            }
        }
        saveFixedItems();
    };
    let getFixedItems = function () {
        if (cachedFixedItems) {
            return cachedFixedItems;
        }
        cachedFixedItems = [];
        let fixedItems = localStorage.getItem(FIXED_ITEMS_KEY);
        if (fixedItems) {
            cachedFixedItems = JSON.parse(fixedItems);
        }
        return cachedFixedItems;
    };
    let fixedItemsCleanup = function (clubPlayerIds) {
        let fixedItems = getFixedItems();
        for (let _i = 0, _a = Array.from(fixedItems); _i < _a.length; _i++) {
            let fixedItem = _a[_i];
            if (!clubPlayerIds[fixedItem]) {
                const index = fixedItems.indexOf(fixedItem);
                if (index > -1) {

                    fixedItems.splice(index, 1);
                }
            }
        }
        saveFixedItems();
    };
    let saveFixedItems = function () {
        localStorage.setItem(FIXED_ITEMS_KEY, JSON.stringify(cachedFixedItems));
    };

    const idToPlayerItem = {};
    const showLoader = (countdown = false) => {
        try {
            if (countDown) {
                css(getElement('.numCounter'), {
                    display: 'block',
                });
            } else {
                css(getElement('.numCounter'), {
                    display: 'none',
                });
            }
        }
        catch (error) {

        }
        addClass(getElement('.ut-click-shield'), 'showing');
        css(getElement('.loaderIcon'), {
            display: 'block',
        });
    };
    const hideLoader = () => {
        try {
            css(getElement('.numCounter'), {
                display: 'none',
            });
            removeClass(getElement('.ut-click-shield'), 'showing');
            css(getElement('.loaderIcon'), {
                display: 'block',
            });
        }
        catch (error) {

        }
    }
    const showNotification = function (
        message,
        type = UINotificationType.POSITIVE
    ) {
        services.Notification.queue([message, type]);
    };
    const getCurrentViewController = () => {
        return getAppMain()
            .getRootViewController()
            .getPresentedViewController()
            .getCurrentViewController();
    };
    const getControllerInstance = () => {
        return getCurrentViewController().getCurrentController()
            .childViewControllers[0];
    };

    const sbcSets = async function () {

        return new Promise((resolve, reject) => {
            services.SBC.requestSets().observe(this, function (obs, res) {
                if (!res.success) {
                    obs.unobserve(this);
                    reject(res.status);
                } else {
                    resolve(res.data);
                }
            });
        });
    };

    const getChallenges = async function (set) {
        return new Promise((resolve, reject) => {

            services.SBC.requestChallengesForSet(set).observe(
                this,
                async function (obs, res) {
                    if (!res.success) {
                        obs.unobserve(this);
                        reject(res.status);
                    } else {
                        resolve(res.data);
                    }
                }
            );
        });
    };

    const loadChallenge = async function (currentChallenge) {
        return new Promise((resolve, reject) => {
            services.SBC.loadChallenge(currentChallenge).observe(
                this,
                function (obs, res) {

                    if (!res.success) {
                        obs.unobserve(this);
                        reject(res.status);
                    } else {
                        resolve(res.data);
                    }
                }
            );
        });
    };

    const fetchSBCData = async (sbcId, challengeId = 0) => {
        //Get SBC Data if given a setId

        let sbcData = await sbcSets();
        let sbcSet = sbcData.sets.filter((e) => e.id == sbcId)
        if (sbcSet.length == 0) {

            createSBCTab();
            return null
        }

        let challenges = await getChallenges(sbcSet[0])
        let awards = []
        let uncompletedChallenges = challenges?.challenges.filter(
            (f) => f.status != 'COMPLETED'
        );
        if (uncompletedChallenges.length == 0) {
            showNotification('SBC not available', UINotificationType.NEGATIVE);
            createSBCTab();
            return null
        }
        if (uncompletedChallenges.length == 1) {
            awards = sbcSet[0].awards.filter(f => f.type == 'pack').map(m => m.value)
        }

        if (challengeId == 0) {
            //Get last/hardest SBC if no challenge given

            challengeId = uncompletedChallenges[uncompletedChallenges.length - 1].id;
        }

        await loadChallenge(
            challenges.challenges.filter((i) => i.id == challengeId)[0]
        );

        let newSbcSquad = new UTSBCSquadOverviewViewController();
        newSbcSquad.initWithSBCSet(sbcSet[0], challengeId);
        let { _challenge } = newSbcSquad;

        const challengeRequirements = _challenge.eligibilityRequirements.map(
            (eligibility) => {
                let keys = Object.keys(eligibility.kvPairs._collection);
                return {
                    scope: SBCEligibilityScope[eligibility.scope],
                    count: eligibility.count,
                    requirementKey: SBCEligibilityKey[keys[0]],
                    eligibilityValues: eligibility.kvPairs._collection[keys[0]],

                };
            }
        );

        return {
            constraints: challengeRequirements,
            formation: _challenge.squad._formation.generalPositions.map((m, i) =>
                _challenge.squad.simpleBrickIndices.includes(i) ? -1 : m
            ),
            challengeId: _challenge.id,
            setId: _challenge.setId,
            brickIndices: _challenge.squad.simpleBrickIndices,
            finalSBC: uncompletedChallenges.length == 1,
            currentSolution: _challenge.squad._players.map(
                (m) => m._item._metaData?.id
            ).slice(0, 11),
            awards: _challenge.awards.filter(f => f.type == 'pack').map(m => m.value).concat(awards)
        };
    };
    let conceptPlayers;
    let sbcLogin = []
    const futHomeOverride = () => {
        const homeHubInit = UTHomeHubView.prototype.init;
        UTHomeHubView.prototype.init = async function () {
            homeHubInit.call(this);
            createSBCTab();
            let players = await fetchPlayers();

            await fetchLowestPriceByRating();
            //    await fetchPlayerPrices(players);
            let sbcs = await sbcSets();
            await fetchPlayerPrices(sbcs.sets.filter(s => s.awards[0]?.item).map(s => s.awards[0]?.item))


            let sbcSettingsLogin = findSBCLogin(getSolverSettings(), 'sbcOnLogin')
            sbcs = sbcs.sets
            sbcs.filter(f => !f.isComplete()).forEach(sbc => {
                sbcSettingsLogin.forEach(sl => {
                    if (sl.parents[1] == sbc.id) {
                        sbcLogin.push([sl.parents[1], sl.parents[2], sbc.name])
                    }
                })
            })

            if (sbcLogin.length > 0) {
                let sbcToTry = sbcLogin.shift();
                console.log(sbcLogin, sbcToTry)
                sbcLogin = sbcLogin.slice()
                services.Notification.queue([
                    sbcToTry[2] + ' SBC Started',
                    UINotificationType.POSITIVE,
                ]);

                solveSBC(sbcToTry[0], sbcToTry[1], true)
            }
            conceptPlayers = await getConceptPlayers();
            await fetchPlayerPrices(conceptPlayers);
        };
    };

    const duplicateDiscount = 0.1;
    const untradeableDiscount = 0.8;
    const conceptPremium = 10;
    let count

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    function countDown() {
        count = Math.max(0, count - 1)
        counter.count(pad(count, 4))
    }
    var counter
    let failedChallenges
    const getSBCPrice = (item, duplicateIds) => {
        if (isItemFixed(item)) {
            return 1
        }

        let sbcPrice = Math.max(getPrice(item), getPrice({ definitionId: item.rating + '_CBR' }), 100)
        if (getPrice(item) == -1) {
            return sbcPrice * 1.5
        }
        if (getPrice(item) == 0) {
            // console.log(item.rating,sbcPrice,getPrice({definitionId:item.rating+'_CBR'}))
            return Math.max(item?._itemPriceLimits?.maximum, sbcPrice * 1.5)
        }
        if (item.concept) {
            return conceptPremium * sbcPrice
        }
        sbcPrice = sbcPrice - (100 - item.rating) //Rating Discount


        sbcPrice = sbcPrice * (duplicateIds.includes(item.id) ? duplicateDiscount : 1) // Dupe Discount


        sbcPrice = sbcPrice * (item.untradeable ? untradeableDiscount : 1)


        return sbcPrice
    }
    const solveSBC = async (sbcId, challengeId, autoSubmit = false, repeat = null, autoOpen = false) => {
        counter = null
        counter = new Counter('.numCounter', { direction: 'rtl', delay: 200, digits: 3 })
        let duplicateIds = await fetchDuplicateIds();

        showLoader();


        let sbcData = await fetchSBCData(sbcId, challengeId);

        if (sbcData == null) {
            hideLoader()
            if (sbcLogin.length > 0) {
                let sbcToTry = sbcLogin.shift();
                sbcLogin = sbcLogin.slice()
                services.Notification.queue([
                    sbcToTry[2] + ' SBC Started',
                    UINotificationType.POSITIVE,
                ]);
                solveSBC(sbcToTry[0], sbcToTry[1], true)
                return;
            }
            showNotification('SBC not available', UINotificationType.NEGATIVE);
            return;
        }
        await sendUnassignedtoTeam()
        let players = await fetchPlayers();


        for (let item of players) {
            idToPlayerItem[item.definitionId] = item;
        }
        await fetchPlayerPrices(players);
        if (getSettings(sbcId, sbcData.challengeId, 'useConcepts')) {
            if (conceptPlayersCollected) {
                players = players.concat(conceptPlayers);
            } else {
                showNotification(
                    'Still Collecting Concept Players, They will not be used for this solution',
                    UINotificationType.NEGATIVE
                );
            }
        }
        let maxRating = getSettings(sbcId, sbcData.challengeId, 'maxRating')
        let useDupes = getSettings(sbcId, sbcData.challengeId, 'useDupes')
        let backendPlayersInput = players
            .filter(
                (item) =>
                    item.loans < 0 && (item.rating <= maxRating || (useDupes && duplicateIds.includes(item.id))) &&
                    (!isItemLocked(item) || duplicateIds.includes(item.id))
            )
            .map((item) => {
                if (!item.groups.length) {
                    item.groups = [0];
                }

                return {
                    id: item.id,
                    name: item._staticData.name,
                    cardType:
                        (item.isSpecial()
                            ? ''
                            : services.Localization.localize(
                                'search.cardLevels.cardLevel' + item.getTier()
                            ) + ' ') +
                        services.Localization.localize('item.raretype' + item.rareflag),
                    assetId: item._metaData?.id,
                    definitionId: item.definitionId,
                    rating: item.rating,
                    teamId: item.teamId,
                    leagueId: item.leagueId,
                    nationId: item.nationId,
                    rarityId: item.rareflag,
                    ratingTier: item.getTier(),
                    isUntradeable: item.untradeable,
                    isDuplicate: duplicateIds.includes(item.id),
                    preferredPosition: item.preferredPosition,
                    possiblePositions: item.possiblePositions,
                    groups: item.groups,
                    isFixed: isItemFixed(item),
                    concept: item.concept,
                    price: getSBCPrice(item, duplicateIds),
                    futBinPrice: getPrice(item)
                };
            });

        const input = JSON.stringify({
            clubPlayers: backendPlayersInput,
            sbcData: sbcData,
            maxSolveTime: getSettings(sbcId, sbcData.challengeId, 'maxSolveTime')
        });
        console.log('Sending SBC to Solve...', backendPlayersInput);
        count = getSettings(sbcId, sbcData.challengeId, 'maxSolveTime')
        showLoader(true);
        let countDownInterval = setInterval(countDown, 1000)
        let solution = await makePostRequest(apiUrl, input);
        clearInterval(countDownInterval)
        if (solution.status_code != 2 && solution.status_code != 4) {

            hideLoader();
            showNotification(solution.status, UINotificationType.NEGATIVE);
            if (sbcLogin.length > 0) {
                let sbcToTry = sbcLogin.shift();
                sbcLogin = sbcLogin.slice()
                services.Notification.queue([
                    sbcToTry[2] + ' SBC Started',
                    UINotificationType.POSITIVE,
                ]);
                solveSBC(sbcToTry[0], sbcToTry[1], true)
            }
            //if (autoSubmit && !sbcData.finalSBC){solveSBC(sbcId,0,true,repeat)}
            return;
        }
        showNotification(
            solution.status,
            solution.status_code != 4
                ? UINotificationType.NEUTRAL
                : UINotificationType.POSITIVE
        );
        console.log(JSON.parse(solution.results));
        let allSbcData = await sbcSets();
        let sbcSet = allSbcData.sets.filter((e) => e.id == sbcData.setId)[0];
        let challenges = await getChallenges(sbcSet)
        let sbcChallenge = challenges.challenges.filter((i) => i.id == sbcData.challengeId)[0]
        await loadChallenge(
            sbcChallenge
        );


        window.sbcSet = sbcSet
        window.challengeId = sbcData.challengeId

        let newSbcSquad = new UTSBCSquadOverviewViewController();
        newSbcSquad.initWithSBCSet(sbcSet, sbcData.challengeId);
        let { _squad, _challenge } = newSbcSquad;


        _squad.removeAllItems()

        let _solutionSquad = [...Array(11)];
        sbcData.brickIndices.forEach(function (item, index) {
            _solutionSquad[item] = new UTItemEntity();
        });
        JSON.parse(solution.results)
            .sort((a, b) => b.Is_Pos - a.Is_Pos)
            .forEach(function (item, index) {
                let findMap = sbcData.formation.map(
                    (currValue, idx) =>
                        ((currValue == item.possiblePositions && item.Is_Pos == 1) ||
                            item.Is_Pos == 0) &&
                        _solutionSquad[idx] == undefined
                );

                _solutionSquad[
                    findMap.findIndex((element) => {
                        return element;
                    })
                ] = players.filter((f) => item.id == f.id)[0];
            });
        _squad.setPlayers(_solutionSquad, true);

        await loadChallenge(_challenge);
        let autoSubmitId = getSettings(sbcId, sbcData.challengeId, 'autoSubmit')
        if (((solution.status_code == autoSubmitId) || autoSubmitId == 1) && autoSubmit) {
            await sbcSubmit(_challenge, sbcSet);
            if (getSettings(sbcId, sbcData.challengeId, 'autoOpenPacks')) {
                console.log('Awards', sbcData.awards)
                repositories.Store.setDirty()


                sbcData.awards.forEach(async function (item, index) {
                    let packs = await getPacks()
                    console.log('Opening Pack', item, packs.packs.filter(f => f.id == item)[0])

                    await openPack(packs.packs.filter(f => f.id == item)[0])

                    goToUnassignedView()

                    await wait(10)
                })

            }
            if (repeat == null) {
                //  console.log('getRepeatCount')
                repeat = getSettings(sbcId, sbcData.challengeId, 'repeatCount')

            }
            console.log(repeat, 'repeatCount', sbcData)
            let totalRepeats = getSettings(sbcId, sbcData.challengeId, 'repeatCount') + 1
            if (repeat != 0) {
                if (repeat < 0) {
                    showNotification(`${Math.abs(repeat)} Completed`);
                }
                else {
                    showNotification(`${totalRepeats - repeat} / ${totalRepeats} Completed`);
                }
                let newRepeat = sbcData.finalSBC ? repeat - 1 : repeat
                solveSBC(sbcId, 0, true, newRepeat)

            }
            if (repeat == 0 && totalRepeats > 0) {
                showNotification(`${totalRepeats} / ${totalRepeats} Completed`);

            }
            if (!getSettings(sbcId, sbcData.challengeId, 'autoOpenPacks')) {
                console.log('going to packs')
                goToPacks()
            }
        }
        else {
            let showSBC = new UTSBCSquadSplitViewController
            showSBC.initWithSBCSet(sbcSet, sbcData.challengeId)
            getCurrentViewController().rootController.getRootNavigationController().popViewController();
            getCurrentViewController().rootController.getRootNavigationController().pushViewController(showSBC);
            services.SBC.saveChallenge(_challenge).observe(
                undefined,
                async function (sender, data) {
                    if (!data.success) {
                        showNotification(
                            'Failed to save squad.',
                            UINotificationType.NEGATIVE
                        );
                        _squad.removeAllItems();
                        hideLoader();
                        if (data.error) {
                            showNotification(
                                `Error code: ${data.error.code}`,
                                UINotificationType.NEGATIVE
                            );
                        }
                        hideLoader();
                        return;
                    }

                }
            );
        }

        if (sbcLogin.length > 0) {
            console.log('end', sbcLogin)
            let sbcToTry = sbcLogin.shift();
            sbcLogin = sbcLogin.slice()
            services.Notification.queue([
                sbcToTry[2] + ' SBC Started',
                UINotificationType.POSITIVE,
            ]);
            solveSBC(sbcToTry[0], sbcToTry[1], true)

        }

        //getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().rootController.getRootNavigationController().pushViewController(currentView);



    };

    const goToPacks = async () => {
        await sendUnassignedtoTeam();
        let ulist = await fetchUnassigned();

        if (ulist.length > 0) {
            goToUnassignedView()
            return
        }
        repositories.Store.setDirty()
        let n = new UTStorePackViewController
        n.init()
        getCurrentViewController().rootController.getRootNavigationController().popViewController()
        getCurrentViewController().rootController.getRootNavigationController().pushViewController(n);
    }
    const goToUnassignedView = async () => {
        repositories.Item.unassigned.clear();
        repositories.Item.unassigned.reset();
        var r = getCurrentViewController().rootController;
        showLoader(),
            services.Item.requestUnassignedItems().observe(this, async function (e, t) {
                var i;

                e.unobserve(r);
                var o = r.getRootNavigationController();
                if (o) {

                    var n = isPhone() ? new UTUnassignedItemsViewController : new UTUnassignedItemsSplitViewController;
                    t.success && JSUtils.isObject(t.response) ? n.initWithItems(null === (i = t.response) || void 0 === i ? void 0 : i.items) : n.init()
                    services.Item.clearTransferMarketCache()
                    await swapDuplicatestoTeam()
                    o.popToRootViewController()
                    o.pushViewController(n)

                }

            })

        hideLoader();
    }
    const getPacks = async () => {
        return new Promise((resolve, reject) => {
            repositories.Store.setDirty()
            services.Store.getPacks('ALL', true, true).observe(this, async function (obs, res) {
                if (!res.success) {
                    obs.unobserve(this);
                    reject(res.status);
                } else {
                    resolve(res.response)
                }
            });
        });
    }

    const sbcSubmitChallengeOverride = () => {
        const sbcSubmit = PopupQueueViewController.prototype.closeActivePopup
        PopupQueueViewController.prototype.closeActivePopup = function () {
            sbcSubmit.call(this);
            createSBCTab()

        }
    }

    const unassignedItemsOverride = () => {
        const unassignedItems = UTSectionedItemListView.prototype.render
        UTSectionedItemListView.prototype.render = async function (...args) {
            let players = []
            for (const { data } of this.listRows) {
                players.push(data);
            }
            await fetchPlayerPrices(players)
            unassignedItems.call(this, ...args);
        }
        const ppItems = UTPlayerPicksView.prototype.setItems
        UTPlayerPicksView.prototype.setItems = async function (...args) {

            await fetchPlayerPrices(args[0])
            ppItems.call(this, ...args);
        }
    }

    const sbcSubmit = async function (challenge, sbcSet, i) {
        return new Promise((resolve, reject) => {

            services.SBC.submitChallenge(challenge, sbcSet, true, services.Chemistry.isFeatureEnabled()).observe(
                this,
                async function (obs, res) {
                    if (!res.success) {
                        obs.unobserve(this);
                        showNotification(
                            'Failed to submit',
                            UINotificationType.NEGATIVE
                        );
                        gClickShield.hideShield(EAClickShieldView.Shield.LOADING)
                        reject(res);

                    } else {
                        showNotification(
                            'SBC Submitted',
                            UINotificationType.POSITIVE
                        );
                        createSBCTab()
                        resolve(res);
                    }
                }
            );
        });
    };

    const sbcViewOverride = () => {
        UTSquadEntity.prototype._calculateRating = function () {
            var t = this.isSBC() ? this.getFieldPlayers() : this.getFieldAndSubPlayers()
                , e = services.Configuration.checkFeatureEnabled(UTServerSettingsRepository.KEY.SQUAD_RATING_FLOAT_CALCULATION_ENABLED)
                , n = 0
                , r = UTSquadEntity.FIELD_PLAYERS;
            if (t.forEach(function (t, e) {
                var i = t.item;
                i.isValid() && (n += i.rating,
                    UTSquadEntity.FIELD_PLAYERS <= e && r++)
            }),
                e) {
                var o = n
                    , a = o;
                0 < r && (o /= r),
                    o = Math.min(o, 99),
                    t.forEach(function (t, e) {
                        var i = t.item;
                        if (i.isValid()) {
                            if (i.rating <= o)
                                return;
                            a += e < UTSquadEntity.FIELD_PLAYERS ? i.rating - o : .5 * (i.rating - o)
                        }
                    }),
                    n = Math.round(a, 2)
            } else {
                var s = Math.min(Math.floor(n / r), 99);
                t.forEach(function (t, e) {
                    var i = t.item;
                    if (i.isValid()) {
                        if (i.rating <= s)
                            return;
                        n += e < UTSquadEntity.FIELD_PLAYERS ? i.rating - s : Math.floor(.5 * (i.rating - s))
                    }
                })
            }
            this._rating = new Intl.NumberFormat('en', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Math.min(Math.max(n / r, 0), 99))
        }
        const squadDetailPanelView = UTSBCSquadDetailPanelView.prototype.init;
        UTSBCSquadDetailPanelView.prototype.init = function (...args) {
            const response = squadDetailPanelView.call(this, ...args);

            const button = createButton('idSolveSbc', 'Solve SBC', async function () {
                const { _challenge } = getControllerInstance();

                solveSBC(_challenge.setId, _challenge.id);
            });
            insertAfter(button, this._btnExchange.__root);
            return response;
        };
    };
    const sbcButtonOverride = () => {
        const UTSBCSetTileView_render = UTSBCSetTileView.prototype.render;
        UTSBCSetTileView.prototype.render = function render() {
            UTSBCSetTileView_render.call(this);
            if (this.data) {
                insertBefore(
                    createElem('span', null, `COMPLETED: ${this.data.timesCompleted}. `),
                    this.__rewardsHeader
                );
            }
        };
    };

    const lockedLabel = 'SBC Unlock';
    const unlockedLabel = 'SBC Lock';
    const fixedLabel = 'SBC Use actual prices';
    const unfixedLabel = 'SBC Set Price to Zero';

    const playerItemOverride = () => {
        const UTDefaultSetItem = UTSlotActionPanelView.prototype.setItem;
        UTSlotActionPanelView.prototype.setItem = function (e, t) {
            const result = UTDefaultSetItem.call(this, e, t);
            // Concept player
            if (e.concept || e.loans > -1 || !e.isPlayer() || !e.id) {
                return result;
            }
            if (!e.isDuplicate() && !isItemFixed(e)) {
                const label = isItemLocked(e) ? lockedLabel : unlockedLabel;
                const button = new UTGroupButtonControl();
                button.init();
                button.setInteractionState(true);
                button.setText(label);
                insertBefore(button, this._btnPlayerBio.__root);
                button.addTarget(
                    this,
                    async () => {
                        if (isItemLocked(e)) {
                            unlockItem(e);
                            button.setText(unlockedLabel);
                            showNotification(`Item unlocked`, UINotificationType.POSITIVE);
                        } else {
                            lockItem(e);
                            button.setText(lockedLabel);
                            showNotification(`Item locked`, UINotificationType.POSITIVE);
                        }
                        getControllerInstance().applyDataChange();
                        getCurrentViewController()
                            .getCurrentController()
                            .rightController.currentController.renderView();
                    },
                    EventType.TAP
                );
            }
            if (!isItemLocked(e)) {
                const fixLabel = isItemFixed(e) ? fixedLabel : unfixedLabel;
                const fixbutton = new UTGroupButtonControl();
                fixbutton.init();
                fixbutton.setInteractionState(true);
                fixbutton.setText(fixLabel);
                insertBefore(fixbutton, this._btnPlayerBio.__root);
                fixbutton.addTarget(
                    this,
                    async () => {
                        if (isItemFixed(e)) {
                            unfixItem(e);
                            fixbutton.setText(unfixedLabel);
                            showNotification(`Removed Must Use`, UINotificationType.POSITIVE);
                        } else {
                            fixItem(e);
                            fixbutton.setText(fixedLabel);
                            showNotification(`Must Use Set`, UINotificationType.POSITIVE);
                        }
                        getControllerInstance().applyDataChange();
                        getCurrentViewController()
                            .getCurrentController()
                            .rightController.currentController.renderView();
                    },
                    EventType.TAP
                );
            }
            return result;
        };

        const UTDefaultAction = UTDefaultActionPanelView.prototype.render;
        UTDefaultActionPanelView.prototype.render = function (e, t, i, o, n, r, s) {
            const result = UTDefaultAction.call(this, e, t, i, o, n, r, s);
            // Concept player
            if (e.concept || e.loans > -1 || !e.isPlayer() || !e.id) {
                return result;
            }
            if (!e.isDuplicate() && !isItemFixed(e)) {
                const label = isItemLocked(e) ? lockedLabel : unlockedLabel;
                if (!this.lockUnlockButton) {
                    const button = new UTGroupButtonControl();
                    button.init();
                    button.setInteractionState(true);
                    button.setText(label);
                    insertBefore(button, this._playerBioButton.__root);
                    button.addTarget(
                        this,
                        async () => {
                            if (isItemLocked(e)) {
                                unlockItem(e);
                                button.setText(unlockedLabel);
                                showNotification(`Item unlocked`, UINotificationType.POSITIVE);
                            } else {
                                lockItem(e);
                                button.setText(lockedLabel);
                                showNotification(`Item locked`, UINotificationType.POSITIVE);
                            }
                            try {
                                getCurrentViewController()
                                    .getCurrentController()
                                    .leftController.renderView();
                                getCurrentViewController()
                                    .getCurrentController()
                                    .rightController.currentController.renderView()
                            }
                            catch (error) {
                                getCurrentViewController()
                                    .getCurrentController()
                                    .leftController.refreshList()
                            }

                        },
                        EventType.TAP
                    );
                    this.lockUnlockButton = button;
                }
            }
            if (!isItemLocked(e)) {
                const fixlabel = isItemFixed(e) ? fixedLabel : unfixedLabel;
                if (!this.fixUnfixButton) {
                    const button = new UTGroupButtonControl();
                    button.init();
                    button.setInteractionState(true);
                    button.setText(fixlabel);
                    insertBefore(button, this._playerBioButton.__root);
                    button.addTarget(
                        this,
                        async () => {
                            if (isItemFixed(e)) {
                                unfixItem(e);
                                button.setText(unfixedLabel);
                                showNotification(
                                    `Removed Must Use`,
                                    UINotificationType.POSITIVE
                                );
                            } else {
                                fixItem(e);
                                button.setText(fixedLabel);
                                showNotification(`Must Use Set`, UINotificationType.POSITIVE);
                            }
                            try {
                                getCurrentViewController()
                                    .getCurrentController()
                                    .leftController.renderView();
                                getCurrentViewController()
                                    .getCurrentController()
                                    .rightController.currentController.renderView()
                            }
                            catch (error) {
                                getCurrentViewController()
                                    .getCurrentController()
                                    .leftController.refreshList()
                            }
                        },
                        EventType.TAP
                    );
                    this.fixUnfixButton = button;
                }
            }
            return result;
        };
        const UTPlayerItemView_renderItem = UTPlayerItemView.prototype.renderItem;
        UTPlayerItemView.prototype.renderItem = async function (item, t) {
            const result = UTPlayerItemView_renderItem.call(this, item, t);

            const duplicateIds = await fetchDuplicateIds()
            if (duplicateIds.includes(item.id)) { this.__root.style.opacity = "0.4"; }

            if (getPrice(item) && getSettings(0, 0, 'showPrices')) {
                let price = getPrice(item) * (isItemFixed(item) ? 0 : 1);
                this.__root.prepend(
                    createElem(
                        'div',
                        { className: 'currency-coins item-price' },
                        price.toLocaleString()
                    )
                );
            }
            if (isItemLocked(item)) {
                addClass(this, 'locked');
            } else {
                removeClass(this, 'locked');
            }
            if (isItemFixed(item)) {
                addClass(this, 'fixed');
            } else {
                removeClass(this, 'fixed');
            }
            return result;
        };
    };

    let priceCacheMinutes = 60;
    let PRICE_ITEMS_KEY = 'futbinprices';
    let cachedPriceItems;

    let getPrice = function (item) {

        let PriceItems = getPriceItems();
        //console.log(PriceItems[item.definitionId])
        let cacheMin = item.concept ? 1440 : getSettings(0, 0, 'priceCacheMinutes')
        let timeStamp = new Date(
            PriceItems[item.definitionId]?.timeStamp
        );

        let now = new Date(Date.now())
        if (PriceItems[item.definitionId]?.lastUpdated == 0) { PriceItems[item.definitionId].lastUpdated = 'Never' }
        let lastUpdated = PriceItems[item.definitionId]?.lastUpdated ?? 'Unknown'

        let cacheDate = timeStamp.getTime() + (cacheMin * 60 * 1000);

        if (PriceItems[item.definitionId]?.lastUpdated == null && PriceItems[item.definitionId]?.price == 0) {
            //  console.log('Unknown 0 Price',PriceItems[item.definitionId],item,PriceItems[item.definitionId].lastUpdated!='Never')
            return null
        }
        if (PriceItems[item.definitionId]?.lastUpdated == 'Never' || lastUpdated.indexOf('weeks') > 0) {
            return PriceItems[item.definitionId]?.price
        }

        if (PriceItems[item.definitionId]?.lastUpdated == 'Never' && PriceItems[item.definitionId]?.price == 0) {
            return -1
        }

        if (
            PriceItems[item.definitionId] &&
            PriceItems[item.definitionId]?.timeStamp &&

            cacheDate < now
        ) {
            //console.log('Cache is old',PriceItems[item.definitionId],item)
            return null;
        }
        let fbPrice = PriceItems[item.definitionId]?.price
        return fbPrice;
    };

    let PriceItem = function (item, price, lastUpdated = null) {
        //  console.log(item, price, lastUpdated)
        let PriceItems = getPriceItems();
        let timeStamp = new Date(Date.now());
        if (lastUpdated == 0) { lastUpdated = 'Never' }
        PriceItems[item.definitionId] = {
            timeStamp: timeStamp,
            price: price,
            lastUpdated: lastUpdated
        };
        savePriceItems();
    };

    let getPriceItems = function () {
        if (cachedPriceItems) {
            return cachedPriceItems;
        }
        cachedPriceItems = {};
        let PriceItems = localStorage.getItem(PRICE_ITEMS_KEY);
        if (PriceItems) {
            cachedPriceItems = JSON.parse(PriceItems);
        }

        return cachedPriceItems;
    };
    let PriceItemsCleanup = function (clubPlayerIds) {
        let PriceItems = getPriceItems();
        for (let _i = 0, _a = Array.from(PriceItems); _i < _a.length; _i++) {
            let PriceItem = _a[_i];
            if (!clubPlayerIds[PriceItem]) {
                PriceItems.delete(PriceItem);
            }
        }
        savePriceItems();
    };
    let savePriceItems = function () {
        localStorage.setItem(PRICE_ITEMS_KEY, JSON.stringify(cachedPriceItems));
    };

    function makeGetRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    resolve(response.responseText);
                },
                onerror: function (error) {
                    reject(error);
                },
            });
        });
    }

    function makePostRequest(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                body: data,
            })
                .then((response) => {
                    // 1. check response.ok
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(response); // 2. reject instead of throw
                })
                .then((json) => {
                    console.log(json);
                    resolve(json);
                })
                .catch((error) => {
                    console.log(error);
                    showNotification(
                        `Please check backend API is running`,
                        UINotificationType.NEGATIVE
                    );
                    hideLoader();
                });
        });
    }
    const convertAbbreviatedNumber = (number) => {
        let base = parseFloat(number);
        if (number.toLowerCase().match(/k/)) {
            return Math.round(base * 1000);
        } else if (number.toLowerCase().match(/m/)) {
            return Math.round(base * 1000000);
        }
        return number * 1;
    };
    const fetchLowestPriceByRating = async () => {
        let PriceItems = getPriceItems();
        for (let i = 45; i <= 80; i++) {
            PriceItem(
                {
                    "definitionId": i + '_CBR',
                },
                i < 75 ? 200 : 400
            )
        }

        const futBinCheapestByRatingResponse = await makeGetRequest(
            `https://www.futbin.com/home-tab/cheapest-by-rating`
        );
        const doc = new DOMParser().parseFromString(futBinCheapestByRatingResponse, 'text/html');
        doc.querySelectorAll('img').forEach((img) => {
            img.remove()

        });

        let cbrRow = doc.getElementById("cheapest-players-row")
        let col9 = cbrRow.getElementsByClassName('col-9')
        for (let i = 0; i < col9.length; i++) {
            PriceItem(
                {
                    "definitionId": col9[i].innerText.replace('Rated players', '').trim() + '_CBR',
                },
                convertAbbreviatedNumber(
                    cbrRow.getElementsByClassName('d-none')[i * 5].innerText.trim()
                )
            );
        };

    };

    const fetchPlayerPrices = async (players) => {
        let duplicateIds = await fetchDuplicateIds();
        let idsArray = players.filter((f) => getPrice(f) == null && f.isPlayer())
            .map((p) => p.definitionId);

        let totalPrices = idsArray.length
        while (idsArray.length) {
            let PriceItems = getPriceItems();

            const playersIdArray = idsArray.splice(0, 30);
            const primaryId = playersIdArray.shift();
            if (!primaryId) {
                continue;
            }
            const refIds = playersIdArray.join(',');
            const futBinResponse = await makeGetRequest(
                `https://www.futbin.com/24/playerPrices?player=${primaryId}&rids=${refIds}`

            );
            let priceResponse;
            try {
                priceResponse = JSON.parse(futBinResponse);
                console.log(`https://www.futbin.com/24/playerPrices?player=${primaryId}&rids=${refIds}`, priceResponse);
            } catch (error) {
                console.log(`https://www.futbin.com/24/playerPrices?player=${primaryId}&rids=${refIds}`, futBinResponse);
                console.error(error);
                await wait();
                continue;
            } if (totalPrices > 1) {
                showNotification(
                    `Fetched ${totalPrices - idsArray.length} / ${totalPrices} Prices`,
                    UINotificationType.NEUTRAL
                )
            }

            for (const id of [primaryId, ...playersIdArray]) {
                let player = players.filter((f) => f.definitionId == id)[0];


                const prices = priceResponse[id]?.prices[getUserPlatform()];

                const lcPrice = prices.LCPrice;

                if (!lcPrice) {
                    //  console.log('Missing Price',lcPrice,PriceItems[player.definitionId])
                    PriceItem(
                        player,
                        0,
                        prices?.updated
                    );
                    continue;
                }

                let cardPrice = parseInt(lcPrice.replace(/[,.]/g, ''));


                if (prices.updated == 0) { prices.updated = 'Never' }
                if (cardPrice == 0 && !prices.updated) {

                    await fetchPlayerPrices(
                        players.filter((f) => f.definitionId == id)
                    )


                } else {
                    PriceItem(
                        player,
                        cardPrice,
                        prices?.updated
                    );
                }
                await wait(0.2)
            }
        }
    }
    const openPack = async (pack) => {
        await sendUnassignedtoTeam();
        let ulist = await fetchUnassigned();

        if (ulist.length > 0) {
            goToUnassignedView()
            return
        }
        return new Promise((resolve, reject) => {

            repositories.Store.setDirty()
            pack.open().observe(this, async function (obs, res) {
                if (!res.success) {
                    obs.unobserve(this);
                    reject(res.status);
                } else {
                    let packPlayers = res.response

                    await fetchPlayerPrices(packPlayers.items)
                    hideLoader();
                    await wait(0.5)
                    console.log(packPlayers.items)
                    await showPack(pack, packPlayers)
                    resolve(res.response)
                }
            });
        });
    };
    const showPack = (pack, packPlayers) => {
        console.log("opening pack")

        return new Promise((resolve, reject) => {
            let c = new UTStoreViewController
            var o = null
                , n = packPlayers.items.filter(function (e) {
                    return e.isPlayer()
                });
            if (0 < n.length) {
                var r = new UTItemUtils
                    , s = n.sort(function (t, e) {

                        return getSBCPrice(e, []) - getSBCPrice(t, [])
                    });
                o = s[0]
            } else
                packPlayers.items.forEach(function (e) {
                    (!o || o.discardValue < e.discardValue) && (o = e)
                });
            console.log(o.rating, o)
            if (o && (o.rating > 85 || !getSettings(0, 0, 'animateWalkouts'))) {

                var a = new UTPackAnimationViewController;
                a.initWithPackData(o, pack.assetId),
                    a.setAnimationCallback(function () {
                        this.dismissViewController(!1, function () {
                            a.dealloc()
                        }),
                            repositories.Store.setDirty()

                    }
                        .bind(c)),
                    a.modalDisplayStyle = "fullscreen",
                    c.presentViewController(a, !0)
            } else {

                goToUnassignedView()
            }
            resolve()
        })
    }
    const packOverRide = async () => {
        const packReveal = UTStoreViewController.prototype.eRevealPack
        UTStoreViewController.prototype.eRevealPack = async function (...args) {
            console.log(...args)
            packReveal.call(this, ...args);
        }
        const packOpen = UTStoreViewController.prototype.eOpenPack;
        UTStoreViewController.prototype.eOpenPack = async function (...args) {
            showLoader();
            await sendUnassignedtoTeam();
            createSBCTab()
            console.log(...args)
            let packs = await getPacks()
            let item = args[2].articleId
            console.log('Opening Pack', item, packs.packs.filter(f => f.id == item)[0])

            await openPack(packs.packs.filter(f => f.id == item)[0])
            goToUnassignedView()
            await wait(10)



        };
    };
    const packItemOverride = () => {
        const storeListView = UTStoreRevealModalListView.prototype.render;

        UTStoreRevealModalListView.prototype.render = function (...args) {
            storeListView.call(this, ...args);
            //   console.log('UTStoreRevealModalListView',this.listRows)
        }
    }
    const playerSlotOverride = () => {
        const playerSlot = UTSquadPitchView.prototype.setSlots;

        UTSquadPitchView.prototype.setSlots = async function (...args) {
            const result = playerSlot.call(this, ...args);
            const slots = this.getSlotViews();
            const squadSlots = [];
            slots.forEach((slot, index) => {
                const item = args[0][index];
                squadSlots.push({
                    item: item._item,
                    rootElement: slot.getRootElement(),
                });
            });

            appendSlotPrice(squadSlots);
            return result;
        };
    };

    const appendSlotPrice = async (squadSlots) => {
        if (!squadSlots.length) {
            return;
        }
        const players = [];
        for (const { item } of squadSlots) {
            players.push(item);
        }

        const prices = await fetchPlayerPrices(players);
        let total = 0;
        const duplicateIds = await fetchDuplicateIds()
        for (const { rootElement, item } of squadSlots) {
            if (duplicateIds.includes(item.id)) { rootElement.style.opacity = "0.4"; }
            const cardPrice = getPrice(item);
            total += cardPrice || 0;

            if (cardPrice) {
                const element = $(rootElement);
                appendPriceToSlot(element, cardPrice);
            }
        }
        appendSquadTotal(total);
    };
    const appendSquadTotal = (total) => {

        if (getSettings(0, 0, 'showPrices')) {
            if ($('.squadTotal').length) {
                $('.squadTotal').text(total.toLocaleString());
            } else {
                $(
                    `<div class="rating chemistry-inline">
          <span class="ut-squad-summary-label">Squad Price</span>
          <div>
            <span class="ratingValue squadTotal currency-coins">${total.toLocaleString()}</span>
          </div>
        </div>
        `
                ).insertAfter($('.chemistry'));
            }
        }
    };
    const appendPriceToSlot = (rootElement, price) => {

        if (getSettings(0, 0, 'showPrices')) {
            rootElement.prepend(
                createElem(
                    'div',
                    { className: 'currency-coins item-price' },
                    price.toLocaleString()
                )
            );
        }
    };


    const getUserPlatform = () => {
        if (services.User.getUser().getSelectedPersona().isPC) {
            return 'pc';
        }
        return 'ps';
    };
    const favTagOverride = () => {
        const favTag = UTSBCFavoriteButtonControl.prototype.watchSBCSet;

        UTSBCFavoriteButtonControl.prototype.watchSBCSet = function () {
            const result = favTag.call(this);
            createSBCTab();
            return result;
        };
    };

    const createSBCTab = async () => {
        services.SBC.repository.reset()
        console.log('Creating Favourites Bar');
        let sets = await sbcSets();
        let favourites = sets.categories.filter((f) => f.name == 'Favourites')[0]
            .setIds;
        let favouriteSBCSets = sets.sets.filter((f) => favourites.includes(f.id)).sort((a, b) => b.timesCompleted - a.timesCompleted)
        let tiles = [];
        $('.sbc-auto').remove();
        if ($('.ut-tab-bar-view').find('.sbc-auto').length === 0 && favouriteSBCSets.length > 0) {
            let NewTab =
                '<nav class="ut-tab-bar sbc-auto"/><button  class="ut-tab-bar-item"><span>SBC 1-click Favourites</span></button><div id="sbcBtns" style="overflow:auto;top:64px;" ></div>';
            $('.ut-tab-bar-view').prepend(NewTab);
        }
        let sbcBtns = document.getElementById('sbcBtns')
        favouriteSBCSets.forEach(function (e) {
            var t = new UTSBCSetTileView();
            t.init(), (t.title = e.name), t.setData(e), t.render();

            let pb = t._progressBar

            var btn = document.createElement("button");
            btn.classList.add("ut-tab-bar-item")
            btn.setAttribute("id", e.id);
            var img = document.createElement("img");
            img.setAttribute("src", t._setImage.src);
            img.width = img.height = '64'
            btn.appendChild(img)
            if (!t.data.isSingleChallenge) {
                btn.appendChild(pb.getRootElement())
            }
            var label = document.createElement('span');
            label.innerHTML = e.name;
            btn.appendChild(label)
            sbcBtns.appendChild(btn)
            $('#' + e.id).hover(
                function () {
                    $(this).addClass('sbcToolBarHover');
                },
                function () {
                    $(this).removeClass('sbcToolBarHover');
                }
            );
            $('#' + e.id).click(async function () {
                createSBCTab();
                services.Notification.queue([
                    e.name + ' SBC Started',
                    UINotificationType.POSITIVE,
                ]);

                solveSBC(e.id, 0, true);
            });
        });
    };

    const sideBarNavOverride = () => {
        const navViewInit = UTGameTabBarController.prototype.initWithViewControllers;
        UTGameTabBarController.prototype.initWithViewControllers = function (tabs) {
            const sbcSolveNav = new UTGameFlowNavigationController();
            sbcSolveNav.initWithRootController(new sbcSettingsController());
            sbcSolveNav.tabBarItem = generateSbcSolveTab();
            tabs.push(sbcSolveNav);
            navViewInit.call(this, tabs);
        };
    };

    let SOLVER_SETTINGS_KEY = 'sbcSolverSettings';
    let cachedSolverSettings;

    let setSolverSettings = function (key, Settings) {
        let SolverSettings = getSolverSettings();
        SolverSettings[key] = Settings
        cachedSolverSettings = SolverSettings
        localStorage.setItem(SOLVER_SETTINGS_KEY, JSON.stringify(cachedSolverSettings));
    };

    let getSolverSettings = function () {
        if (cachedSolverSettings) {
            return cachedSolverSettings;
        }
        cachedSolverSettings = {};
        let SolverSettings = localStorage.getItem(SOLVER_SETTINGS_KEY);
        if (SolverSettings) {
            cachedSolverSettings = JSON.parse(SolverSettings);
        }
        else {
            cachedSolverSettings = {}
        }

        return cachedSolverSettings;
    };




    const generateSbcSolveTab = () => {
        const sbcSolveTab = new UTTabBarItemView();
        sbcSolveTab.init();
        sbcSolveTab.setTag(6);
        sbcSolveTab.setText('SBC Solver');
        sbcSolveTab.addClass('icon-sbcSettings');
        return sbcSolveTab;
    };

    const sbcSettingsController = function (t) {
        UTHomeHubViewController.call(this);
    };

    JSUtils.inherits(sbcSettingsController, UTHomeHubViewController);

    sbcSettingsController.prototype._getViewInstanceFromData = function () {
        return new sbcSettingsView();
    };

    sbcSettingsController.prototype.viewDidAppear = function () {
        this.getNavigationController().setNavigationVisibility(true, true);
    };
    sbcSettingsController.prototype.viewWillDisappear = function () {
        this.getNavigationController().setNavigationVisibility(false, false);
    };
    sbcSettingsController.prototype.getNavigationTitle = function () {
        return 'SBC Solver';
    };

    const sbcSettingsView = function (t) {
        UTHomeHubView.call(this);
    };

    JSUtils.inherits(sbcSettingsView, UTHomeHubView);


    sbcSettingsView.prototype._generate = function _generate() {



        if (!this._generated) {
            var e = document.createElement("div");
            e.classList.add("ut-market-search-filters-view"),
                e.classList.add("floating");
            e.classList.add("sbc-settings-container");

            var f = document.createElement("div");
            f.classList.add("ut-pinned-list"),
                f.classList.add("sbc-settings");
            e.appendChild(f)

            var g = document.createElement("div");

            g.classList.add("sbc-settings-header"),
                g.classList.add("main-header");
            var h1 = document.createElement('H1');
            h1.innerHTML = "SBC Solver Settings";
            g.appendChild(h1)
            f.appendChild(g)
            let sbcUITile = createSettingsTile(f, 'Customise UI', 'ui')
            createToggle(sbcUITile, 'Collect Concept Player Prices (Must be enabled to use concepts in SBC)', 'collectConcepts', getSettings(0, 0, 'collectConcepts'), (toggleCC) => {
                saveSettings(0, 0, 'collectConcepts', toggleCC.getToggleState())
                getConceptPlayers();
            })
            createToggle(sbcUITile, 'Skip non-walkout animations', 'animateWalkouts', getSettings(0, 0, 'animateWalkouts'), (toggleAW) => {
                saveSettings(0, 0, 'animateWalkouts', toggleAW.getToggleState())
            })
            createToggle(sbcUITile, 'Show Prices', 'showPrices', getSettings(0, 0, 'showPrices'), (toggleSP) => {
                saveSettings(0, 0, 'showPrices', toggleSP.getToggleState())
            })
            createNumberSpinner(sbcUITile, 'Price Cache Minutes', 'priceCacheMinutes', 1, 1440, getSettings(0, 0, 'priceCacheMinutes'), (numberspinnerPCM) => {
                saveSettings(0, 0, 'priceCacheMinutes', numberspinnerPCM.getValue())
            })
            let panel = createPanel()
            let clearPricesBtn = createButton('clearPrices', 'Clear All Prices', () => { cachedPriceItems = null; localStorage.removeItem(PRICE_ITEMS_KEY) })
            panel.appendChild(clearPricesBtn)
            sbcUITile.appendChild(panel)

            let sbcRulesTile = createSettingsTile(f, 'Customise SBC', 'customRules')
            createSBCCustomRulesPanel(sbcRulesTile)



            this.__root = e,
                this._generated = !0
        }
    };
    let challenges
    let sbcSet
    const createSBCCustomRulesPanel = async (parent) => {
        let sbcData = await sbcSets();

        let SBCList = sbcData.sets.sort(function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        }).filter(f => !f.isComplete()).map(e =>
            new UTDataProviderEntryDTO(e.id, e.id, e.name)
        )
        SBCList.unshift(new UTDataProviderEntryDTO(0, 0, 'All SBCS'))
        createDropDown(parent,
            'Choose SBC',
            'sbcId',
            SBCList,
            '1',
            async (dropdown) => {

                if (document.contains(document.getElementsByClassName('ut-sbc-challenge-requirements-view')[0])) {
                    document.getElementsByClassName('ut-sbc-challenge-requirements-view')[0].remove()
                }
                let challenge = []
                if (dropdown.getValue() != 0) {
                    let allSbcData = await sbcSets();
                    sbcSet = allSbcData.sets.filter((e) => e.id == dropdown.getValue())[0];

                    challenges = await getChallenges(sbcSet)

                    challenge = challenges.challenges.map(e =>
                        new UTDataProviderEntryDTO(e.id, e.id, e.name)
                    )
                }
                challenge.unshift(new UTDataProviderEntryDTO(0, 0, 'All Challenges'))
                createDropDown(parent, 'Choose Challenge', 'sbcChallengeId', challenge, null, async (dropdownChallenge) => {
                    if (document.contains(document.getElementsByClassName('ut-sbc-challenge-requirements-view')[0])) {
                        document.getElementsByClassName('ut-sbc-challenge-requirements-view')[0].remove()
                    }
                    let sbcParamsTile = createSettingsTile(parent, 'SBC Solver Paramaters', 'submitParams')
                    createDropDown(sbcParamsTile,
                        '1-click Auto Submit',
                        'autoSubmit',
                        [{ name: 'Always', id: 1 },
                        { name: 'Optimal', id: 4 },
                        { name: 'Never', id: 0 }].map(e =>
                            new UTDataProviderEntryDTO(e.id, e.id, e.name)
                        ),
                        getSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'autoSubmit'),
                        (dropdownAS) => {
                            saveSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'autoSubmit', parseInt(dropdownAS.getValue()))
                        })
                    createNumberSpinner(sbcParamsTile, 'Repeat Count (-1 repeats infinitely)', 'repeatCount', -1, 100, getSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'repeatCount'), (numberspinnerRC) => {
                        saveSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'repeatCount', numberspinnerRC.getValue())
                    })
                    createToggle(sbcParamsTile, 'Automatically try SBC on Login', 'sbcOnLogin', getSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'sbcOnLogin'), (toggleLOG) => {
                        saveSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'sbcOnLogin', toggleLOG.getToggleState())
                    })
                    createToggle(sbcParamsTile, 'Use Concepts', 'useConcepts', getSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'useConcepts'), (toggleUC) => {
                        saveSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'useConcepts', toggleUC.getToggleState())
                    })
                    createToggle(sbcParamsTile, 'Automatically Open Reward Packs', 'autoOpenPacks', getSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'autoOpenPacks'), (toggleAO) => {
                        saveSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'autoOpenPacks', toggleAO.getToggleState())
                    })
                    createNumberSpinner(sbcParamsTile, 'Player Max Rating', 'maxRating', 48, 99, getSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'maxRating'), (numberspinnerMR) => {
                        saveSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'maxRating', numberspinnerMR.getValue())
                    })
                    createToggle(sbcParamsTile, 'Ignore Max Rating for Duplicates', 'useDupes', getSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'useDupes'), (toggleUD) => {
                        saveSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'useDupes', toggleUD.getToggleState())
                    })
                    createNumberSpinner(sbcParamsTile, 'API Max Solve Time', 'maxSolveTime', 10, 990, getSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'maxSolveTime'), (numberspinnerMST) => {
                        saveSettings(dropdown.getValue(), dropdownChallenge.getValue(), 'maxSolveTime', numberspinnerMST.getValue())
                    })


                })
            })
    }
    const saveSettings = (sbc, challenge, id, value) => {
        let settings = getSolverSettings()
        settings['sbcSettings'] ??= {}
        let sbcSettings = settings['sbcSettings']
        sbcSettings[sbc] ??= {}
        sbcSettings[sbc][challenge] ??= {}
        sbcSettings[sbc][challenge][id] = value

        setSolverSettings('sbcSettings', sbcSettings)
    }
    const getSettings = (sbc, challenge, id) => {
        let settings = getSolverSettings()
        let returnValue = settings['sbcSettings']?.[sbc]?.[challenge]?.[id] ?? settings['sbcSettings']?.[sbc]?.[0]?.[id] ?? settings['sbcSettings']?.[0]?.[0]?.[id]
        return returnValue

    }
    const defaultSBCSolverSettings = {
        apiUrl: 'http://127.0.0.1:8000/solve',
        useConcepts: false,
        collectConcepts: false,
        animateWalkouts: true,
        autoSubmit: 0,
        maxSolveTime: 120,
        priceCacheMinutes: 60,
        maxRating: 99,
        repeatCount: 0,
        showPrices: true,
        useDupes: true,
        autoOpenPacks: false
    };
    const initDefaultSettings = () => {
        Object.keys(defaultSBCSolverSettings).forEach(id =>
            saveSettings(0, 0, id, getSettings(0, 0, id) ?? defaultSBCSolverSettings[id]))
    }
    const createPanel = () => {
        var panel = document.createElement("div");
        panel.classList.add("sbc-settings-field"),
            panel.classList.add("panelActionRow");
        return panel
    }
    const createNumberSpinner = (parentDiv, label, id, min = 0, max = 100, value = 1, target = () => { }) => {
        var i = document.createElement("div");
        i.classList.add("panelActionRow");
        var o = document.createElement("div");
        o.classList.add("buttonInfoLabel");
        var spinnerLabel = document.createElement("span")
        spinnerLabel.classList.add("spinnerLabel")
        spinnerLabel.innerHTML = label
        o.appendChild(spinnerLabel)
        i.appendChild(o)
        let spinner = new UTNumberInputSpinnerControl
        let panel = createPanel()

        spinner.init()
        spinner.setLimits(min, max)
        spinner.setValue(value)
        spinner.addTarget(spinner, target, EventType.CHANGE)
        panel.appendChild(i)
        panel.appendChild(spinner.getRootElement())
        //console.log(panel)
        parentDiv.appendChild(panel)
        return panel

    }
    const createDropDown = (parentDiv, label, id, options, value, target) => {
        if (document.contains(document.getElementById(id))) {
            document.getElementById(id).remove();
        }

        i = document.createElement("div");

        i.classList.add("panelActionRow");
        var o = document.createElement("div");
        o.classList.add("buttonInfoLabel");
        var spinnerLabel = document.createElement("span")
        spinnerLabel.classList.add("spinnerLabel")
        spinnerLabel.innerHTML = label
        o.appendChild(spinnerLabel)
        i.appendChild(o)
        let dropdown = new UTDropDownControl
        let panel = createPanel()
        panel.appendChild(i)
        panel.appendChild(dropdown.getRootElement())
        panel.setAttribute("id", id);
        dropdown.init()

        dropdown.setOptions(options)

        dropdown.addTarget(dropdown, target, EventType.CHANGE)
        parentDiv.appendChild(panel)
        dropdown.setIndexById(value)
        dropdown._triggerActions(EventType.CHANGE)
        return dropdown
    }
    const createToggle = (parentDiv, label, id, value, target) => {
        let toggle = new UTToggleCellView

        let panel = createPanel()

        panel.appendChild(toggle.getRootElement())
        toggle.init()

        if (value) {
            toggle.toggle()
        }
        toggle.setLabel(label)

        toggle.addTarget(toggle, target, EventType.TAP)
        toggle._triggerActions(EventType.TAP)
        parentDiv.appendChild(panel)
        return panel

    }
    const createSettingsTile = (parentDiv, label, id) => {
        if (document.contains(document.getElementById(id))) {
            document.getElementById(id).remove();
        }

        var tile = document.createElement("div");
        tile.setAttribute("id", id);
        tile.classList.add("tile");
        tile.classList.add("col-1-1");
        tile.classList.add("sbc-settings-wrapper");
        tile.classList.add("main-header");
        tile.classList.add("ut-tile-transfer-market");

        var tileheader = document.createElement("div");
        tileheader.classList.add("sbc-settings-header");
        var h1 = document.createElement('H1');
        h1.innerHTML = label;
        tileheader.appendChild(h1);
        tile.appendChild(tileheader);
        var tileContent = document.createElement("div");
        tileContent.classList.add("sbc-settings-section");
        tile.appendChild(tileContent);
        parentDiv.appendChild(tile)
        return tileContent
    }


    function Counter(selector, settings) {
        let shield = getElement('.ut-click-shield')
        if (!document.contains(document.getElementsByClassName('numCounter')[0])) {
            var counterContent = document.createElement("div");
            counterContent.classList.add("numCounter");
            shield.appendChild(counterContent);
        }
        this.settings = Object.assign({
            digits: 5,
            delay: 250, // ms
            direction: ''  // ltr is default
        }, settings || {})

        var scopeElm = document.querySelector(selector)

        // generate digits markup
        var digitsHTML = Array(this.settings.digits + 1).join('<div><b data-value="0"></b></div>')
        scopeElm.innerHTML = digitsHTML;

        this.DOM = {
            scope: scopeElm,
            digits: scopeElm.querySelectorAll('b')
        }

        this.DOM.scope.addEventListener('transitionend', e => {
            if (e.pseudoElement === "::before" && e.propertyName == 'margin-top') {
                e.target.classList.remove('blur')
            }
        })

        this.count()
    }

    Counter.prototype.count = function (newVal) {
        var countTo, className,
            settings = this.settings,
            digitsElms = this.DOM.digits;

        // update instance's value
        this.value = newVal || this.DOM.scope.dataset.value | 0

        if (!this.value) return;

        // convert value into an array of numbers
        countTo = (this.value + '').split('')

        if (settings.direction == 'rtl') {
            countTo = countTo.reverse()
            digitsElms = [].slice.call(digitsElms).reverse()
        }

        // loop on each number element and change it
        digitsElms.forEach(function (item, i) {
            if (+item.dataset.value != countTo[i] && countTo[i] >= 0)
                setTimeout(function (j) {
                    var diff = Math.abs(countTo[j] - +item.dataset.value);
                    item.dataset.value = countTo[j]
                    if (diff > 3)
                        item.className = 'blur';
                }, i * settings.delay, i)
        })
    }

    function findSBCLogin(obj, keyToFind) {
        let results = [];

        function recursiveSearch(obj, parents = []) {
            if (typeof obj === 'object' && obj !== null) {
                for (let key in obj) {
                    if (key === keyToFind && obj[key] === true) {
                        results.push({
                            value: obj[key],
                            parents: [...parents, key]
                        });
                    }
                    recursiveSearch(obj[key], [...parents, key]);
                }
            }
        }

        recursiveSearch(obj);
        return results;
    }

    const init = () => {
        let isAllLoaded = false;
        if (services.Localization) {
            isAllLoaded = true
        }
        if (isAllLoaded) {
            sbcViewOverride();
            futHomeOverride();
            sbcButtonOverride();
            playerItemOverride();
            playerSlotOverride();
            packOverRide();
            sideBarNavOverride();
            favTagOverride();
            sbcSubmitChallengeOverride();
            unassignedItemsOverride();
            initDefaultSettings();
        } else {
            setTimeout(init, 4000);
        }
    };
    init();
})();
