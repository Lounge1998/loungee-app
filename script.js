    let currentEmail='',currentUserKey='',rtdb=null,auth=null;
    let userData={points:0,gems:0,lastSpinTime:0,activeCounter:'لا يوجد',activeCounterVal:0,customId:'',name:'',avatar:'',bio:'',lastWithdrawTime:0,isBanned:false,whatsapp:'',withdrawCount:0,isAgent:false,agentTelegram:'',agentWhatsapp:'',agentBag:0,agentProvince:'',agentAvatar:'',gameWins:0,userClicksCount:0,isVerified:false,verificationPhone:'',verificationStatus:'none',lastMemoryGameTime:0, lastOutOfOrderTime:0};
    let base64Image='',activeChatFriendKey='',activeChatFriendName='',timerInterval=null;
    let globalAppSettings={withdrawLocked:false,dailyCounterLocked:false,tickerText:'أهلاً بكم في منصة Lounge الرسمية.'};
    let totalWheelDegrees=0, pendingBuyItem = null;
    let selectedWithdrawMethodName = 'زين كاش (Zain Cash)';
    let activeRoomKey = null;

    const fullQuestionsPool = [
        { id: 1, q: "ما هي عاصمة جمهورية العراق؟", correct: "بغداد", wrong: "البصرة" },
        { id: 2, q: "كم عدد سور القرآن الكريم؟", correct: "114 سورة", wrong: "120 سورة" },
        { id: 3, q: "في أي قارة تقع دولة تونس؟", correct: "أفريقيا", wrong: "آسيا" },
        { id: 4, q: "ما هو العنصر الكيميائي الذي يرمز له بالرمز (O)؟", correct: "الأكسجين", wrong: "الحديد" },
        { id: 5, q: "كم عدد ركعات صلاة الفجر؟", correct: "ركعتان", wrong: "4 ركعات" },
        { id: 6, q: "ما هي عاصمة جمهورية مصر العربية؟", correct: "القاهرة", wrong: "الإسكندرية" },
        { id: 7, q: "كم عدد أركان الإسلام؟", correct: "5 أركان", wrong: "4 أركان" },
        { id: 8, q: "في أي قارة تقع دولة اليابان؟", correct: "آسيا", wrong: "أوروبا" },
        { id: 9, q: "ما هو أكبر كوكب في المجموعة الشمسية؟", correct: "المشتري", wrong: "زحل" },
        { id: 10, q: "كم عدد أيام السنة الهجرية؟", correct: "354 أو 355 يوماً", wrong: "365 يوماً" },
        { id: 11, q: "ما هي عاصمة دولة الإمارات العربية المتحدة؟", correct: "أبوظبي", wrong: "دبي" },
        { id: 12, q: "كم عدد قارات العالم؟", correct: "7 قارات", wrong: "5 قارات" }
    ];

    let currentDailyQuestions = [];
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    let currentQuestion = null;
    let isCompletedToday = false;
    let clickDebounceTimer = null;

    function initWindEffectInCircle() {
        let emblem = document.getElementById('mainDailyCircleEmblem');
        if(!emblem) return;
        emblem.innerHTML = '';
        for(let i=0; i<4; i++){
            let line = document.createElement('div');
            line.className = 'wind-effect-line';
            line.style.top = `${15 + (i * 14)}px`;
            line.style.width = `${30 + (i * 10)}px`;
            line.style.animationDelay = `${i * 0.4}s`;
            emblem.appendChild(line);
        }
    }

    function openSocialLinksModal(){ document.getElementById('socialLinksModal').style.display = 'flex'; }
    function closeSocialLinksModal(){ document.getElementById('socialLinksModal').style.display = 'none'; }

    function copySocialLink(linkText){
        safeCopyTextToClipboard(linkText, "📋 تم نسخ الرابط بنجاح!");
    }

    function switchGiftSection(sectionName) {
        let btnInt = document.getElementById('giftTabInteractive');
        let btnExc = document.getElementById('giftTabExclusive');
        let secInt = document.getElementById('giftSectionInteractive');
        let secExc = document.getElementById('giftSectionExclusive');
        
        if(sectionName === 'interactive'){
            btnInt.className = "shop-tab-btn active-gold";
            btnExc.className = "shop-tab-btn";
            secInt.classList.add('active');
            secExc.classList.remove('active');
        } else {
            btnInt.className = "shop-tab-btn";
            btnExc.className = "shop-tab-btn active-gold";
            secInt.classList.remove('active');
            secExc.classList.add('active');
        }
    }

    function showNeonPopup(message) {
        document.getElementById('neonPopupMessageText').innerText = message;
        document.getElementById('neonPopupModal').style.display = 'flex';
    }
    function closeNeonPopup() {
        document.getElementById('neonPopupModal').style.display = 'none';
    }

    function safeCopyTextToClipboard(textToCopy, successMsg = "📋 تم النسخ بنجاح!") {
        if (!textToCopy) return showNeonPopup("⚠️ لا يوجد نص للنسخ!");
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNeonPopup(successMsg);
            }).catch(() => {
                fallbackCopyTextMethod(textToCopy, successMsg);
            });
        } else {
            fallbackCopyTextMethod(textToCopy, successMsg);
        }
    }

    function fallbackCopyTextMethod(textToCopy, successMsg) {
        try {
            let textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";  
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            let successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                showNeonPopup(successMsg);
            } else {
                showNeonPopup("❌ تعذر النسخ، يرجى النسخ يدويًا.");
            }
        } catch (err) {
            showNeonPopup("❌ تعذر النسخ، يرجى النسخ يدويًا.");
        }
    }

    function copyUsdtAddress(){
        let addr = "TU31n5NnWAnhQ83YTpYFXvjhrAqxNfkn8F";
        safeCopyTextToClipboard(addr, "📋 تم نسخ عنوان محفظة USDT TRC20 بنجاح!");
    }

    function copyTextToClipboard(text){
        safeCopyTextToClipboard(text, "📋 تم نسخ النص بنجاح!");
    }

    function toggleGiftBoxPanel(){
        let panel = document.getElementById('giftBoxPopupPanel');
        if(!panel) return;
        panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    }

    function openCreateRoomModal(){
        rtdb.ref('rooms').once('value', snap=>{
            let hasRoom = false;
            snap.forEach(item=>{
                if(item.val().creatorKey === currentUserKey) hasRoom = true;
            });
            if(hasRoom) return showNeonPopup("⚠️ عذراً، لا يمكنك إنشاء أكثر من غرفة محادثة واحدة.");
            document.getElementById('createRoomModal').style.display='flex';
        });
    }
    function closeCreateRoomModal(){ document.getElementById('createRoomModal').style.display='none'; }

    function confirmCreateRoom(){
        let roomName = document.getElementById('newRoomNameInput').value.trim();
        let coverFile = document.getElementById('newRoomCoverInput').files[0];
        if(!roomName) return showNeonPopup("⚠️ يرجى إدخال اسم الغرفة!");

        rtdb.ref('rooms').once('value', snap=>{
            let hasRoom = false;
            snap.forEach(item=>{
                if(item.val().creatorKey === currentUserKey) hasRoom = true;
            });
            if(hasRoom){
                closeCreateRoomModal();
                return showNeonPopup("⚠️ عذراً، لديك غرفة مسجلة مسبقاً بالفعل.");
            }

            let createAction = (coverBase64)=>{
                let roomId = userData.customId || '1';
                rtdb.ref('rooms').push({
                    roomId: roomId,
                    roomName: roomName,
                    creatorKey: currentUserKey,
                    creatorName: userData.name || 'مستخدم',
                    creatorCustomId: userData.customId || '---',
                    cover: coverBase64 || 'https://via.placeholder.com/85',
                    timestamp: Date.now()
                }).then(()=>{
                    closeCreateRoomModal();
                    document.getElementById('newRoomNameInput').value = '';
                    showNeonPopup("✅ تم إنشاء الغرفة بنجاح.");
                    loadRoomsList();
                });
            };

            if(coverFile){
                let reader = new FileReader();
                reader.onload = (e)=> createAction(e.target.result);
                reader.readAsDataURL(coverFile);
            } else {
                createAction('');
            }
        });
    }

    function loadRoomsList(){
        if(!rtdb) return;
        rtdb.ref('rooms').once('value', snap=>{
            let container = document.getElementById('roomsListContainer');
            let createSection = document.getElementById('createRoomSectionCard');
            if(!container) return;

            let userHasRoom = false;
            let html = '';
            
            snap.forEach(item=>{
                let r = item.val();
                let rKey = item.key;
                if(r.creatorKey === currentUserKey) userHasRoom = true;

                let deleteAdminBtn = '';
                if(currentEmail === 'msaftwtn@gmail.com' || userData.customId === '1'){
                    deleteAdminBtn = `<button class="action-btn" style="background:#ef4444;color:#fff;padding:4px 8px;font-size:10px;margin-top:4px;" onclick="adminDeleteRoomByAdmin('${rKey}')">حذف الغرفة (إدارة) 🗑️</button>`;
                }

                html += `<div style="background:rgba(30,41,59,0.85); border:1px solid rgba(236,72,153,0.3); border-radius:12px; padding:10px; display:flex; justify-content:space-between; align-items:center; text-align:right; margin-bottom:6px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${r.cover}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid #ec4899;" alt="روم">
                        <div>
                            <div style="font-size:13px; color:#f472b6; font-weight:bold;">${r.roomName}</div>
                            <div style="font-size:10px; color:#38bdf8; margin-top:2px;">🏠 معرف الغرفة: ${r.roomId} | المنشئ: ${r.creatorName}</div>
                            ${deleteAdminBtn}
                        </div>
                    </div>
                    <div>
                        <button class="action-btn btn-purple" style="padding:6px 12px; font-size:11px; background:linear-gradient(135deg,#db2777,#9333ea)" onclick="joinRoom('${rKey}', '${r.roomId}', '${r.roomName}', '${r.cover}')">دخول 🚪</button>
                    </div>
                </div>`;
            });

            if(createSection){
                createSection.style.display = userHasRoom ? 'none' : 'block';
            }

            if(!snap.exists()){
                container.innerHTML = "<div style='text-align:center;color:#94a3b8;padding:20px;font-size:11px;'>لا توجد غرف محادثة متاحة حالياً.</div>";
            } else {
                container.innerHTML = html;
            }
        });
    }

    function adminDeleteRoomByAdmin(roomKey){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        if(!confirm("⚠️ هل أنت متأكد من حذف هذه الغرفة نهائياً؟")) return;
        rtdb.ref(`rooms/${roomKey}`).remove().then(()=>{
            showNeonPopup("✅ تم حذف الغرفة بنجاح.");
            loadRoomsList();
        });
    }

    function searchRoomById(){
        let searchId = document.getElementById('searchRoomIdInput').value.trim();
        if(!searchId) return loadRoomsList();
        rtdb.ref('rooms').once('value', snap=>{
            let container = document.getElementById('roomsListContainer');
            if(!container) return;
            let found = false;
            let html = '';
            snap.forEach(item=>{
                let r = item.val();
                let rKey = item.key;
                if(String(r.roomId) === String(searchId)){
                    found = true;
                    html += `<div style="background:rgba(30,41,59,0.85); border:1px solid rgba(236,72,153,0.3); border-radius:12px; padding:10px; display:flex; justify-content:space-between; align-items:center; text-align:right;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <img src="${r.cover}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid #ec4899;" alt="روم">
                            <div>
                                <div style="font-size:13px; color:#f472b6; font-weight:bold;">${r.roomName}</div>
                                <div style="font-size:10px; color:#38bdf8; margin-top:2px;">🏠 معرف الغرفة: ${r.roomId} | المنشئ: ${r.creatorName}</div>
                            </div>
                        </div>
                        <div>
                            <button class="action-btn btn-purple" style="padding:6px 12px; font-size:11px; background:linear-gradient(135deg,#db2777,#9333ea)" onclick="joinRoom('${rKey}', '${r.roomId}', '${r.roomName}', '${r.cover}')">دخول 🚪</button>
                        </div>
                    </div>`;
                }
            });
            container.innerHTML = found ? html : "<div style='text-align:center;color:#ef4444;padding:20px;font-size:11px;'>لم يتم العثور على غرفة بهذا المعرف.</div>";
        });
    }

    function joinRoom(rKey, roomId, roomName, cover){
        if(activeRoomKey && activeRoomKey !== rKey){
            rtdb.ref(`room_users/${activeRoomKey}/${currentUserKey}`).remove();
            rtdb.ref(`room_messages/${activeRoomKey}`).off();
            rtdb.ref(`room_users/${activeRoomKey}`).off();
        }

        activeRoomKey = rKey;
        document.getElementById('currentRoomTitleDisplay').innerText = roomName;
        document.getElementById('currentRoomIdDisplay').innerText = `معرف الغرفة: ${roomId}`;
        document.getElementById('currentRoomCoverImg').src = cover;
        navigateTo('singleRoomScreen');

        let userPresenceRef = rtdb.ref(`room_users/${rKey}/${currentUserKey}`);
        userPresenceRef.set({
            name: userData.name || 'مستخدم',
            customId: userData.customId || '---',
            avatar: userData.avatar || 'https://via.placeholder.com/35'
        });
        userPresenceRef.onDisconnect().remove();

        rtdb.ref(`room_messages/${rKey}`).limitToLast(50).on('value', snap=>{
            let area = document.getElementById('roomMessagesArea');
            if(!area) return;
            if(!snap.exists()){ area.innerHTML = "أهلاً بك في الغرفة. ابدأ المحادثة أو أرسل الهدايا بأمان."; return; }
            let h = '';
            snap.forEach(m=>{
                let msg = m.val();
                let senderAvatar = msg.senderAvatar || 'https://via.placeholder.com/35';
                let senderName = msg.senderName || 'مستخدم';
                let messageText = msg.text || '';
                
                if(msg.isGiftCard){
                    h += `<div style="margin-bottom:10px; display:flex; flex-direction:column; align-items:center; text-align:center; background:linear-gradient(135deg, rgba(219,39,119,0.25), rgba(147,51,234,0.25)); border:1.5px solid #ec4899; padding:10px; border-radius:14px; box-shadow:0 0 15px rgba(236,72,153,0.4);">
                        <img src="${senderAvatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:2px solid #ec4899; margin-bottom:4px;" alt="صورة">
                        <div style="font-size:11px; color:#f472b6; font-weight:bold;">${senderName} أرسل هدية مميزة! 🎁</div>
                        <div style="font-size:24px; margin:6px 0;">${msg.giftEmoji}</div>
                        <div style="font-size:12px; color:#fff; font-weight:bold;">${msg.giftDesc}</div>
                    </div>`;
                } else {
                    h += `<div style="margin-bottom:10px; display:flex; align-items:flex-start; gap:8px; text-align:right;">
                        <img src="${senderAvatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:1px solid #ec4899; flex-shrink:0;" alt="صورة المستخدم">
                        <div style="flex:1;">
                            <div style="font-size:10px; color:#f472b6; font-weight:bold; margin-bottom:2px;">${senderName}</div>
                            <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:10px; word-break:break-word; color:#fff; font-size:11px;">${messageText}</div>
                        </div>
                    </div>`;
                }
            });
            area.innerHTML = h;
            area.scrollTop = area.scrollHeight;
        });

        rtdb.ref(`room_users/${rKey}`).on('value', snap=>{
            let targetSelect = document.getElementById('giftTargetSelect');
            let attendanceDisplay = document.getElementById('roomAttendanceDisplay');
            if(!targetSelect || !attendanceDisplay) return;
            
            let count = 0, selectHtml = '<option value="all">الجميع (الشات العام)</option>';
            snap.forEach(u=>{
                let dat = u.val();
                let uKey = u.key;
                count++;
                if(uKey !== currentUserKey) selectHtml += `<option value="${uKey}">${dat.name}</option>`;
            });
            attendanceDisplay.innerText = `👁️‍🗨️ الحضور: ${count}`;
            targetSelect.innerHTML = selectHtml;
        });
    }

    function leaveCurrentRoom(){
        if(activeRoomKey && currentUserKey){
            rtdb.ref(`room_users/${activeRoomKey}/${currentUserKey}`).remove();
            rtdb.ref(`room_messages/${activeRoomKey}`).off();
            rtdb.ref(`room_users/${activeRoomKey}`).off();
        }
        activeRoomKey = null;
        navigateTo('roomsScreen');
    }

    function sendRoomChatMessage(){
        let txt = document.getElementById('roomChatInputMsg').value.trim();
        if(!txt || !activeRoomKey) return;
        rtdb.ref(`room_messages/${activeRoomKey}`).push({
            senderKey: currentUserKey,
            senderName: userData.name || 'مستخدم',
            senderAvatar: userData.avatar || 'https://via.placeholder.com/35',
            text: txt,
            timestamp: Date.now()
        }).then(()=>{
            document.getElementById('roomChatInputMsg').value = '';
        });
    }

    function sendRoomGift(giftEmoji, giftPrice){
        if(!activeRoomKey) return;
        let targetVal = document.getElementById('giftTargetSelect').value;
        let myPts = userData.points || 0;
        if(myPts < giftPrice) return showNeonPopup(`❌ رصيدك غير كافي لإرسال هذه الهدية. رصيدك (${myPts.toLocaleString()}) بينما السعر (${giftPrice.toLocaleString()}).`);

        rtdb.ref(`room_users/${activeRoomKey}`).once('value', snap=>{
            let isAlone = true;
            snap.forEach(u=>{ if(u.key !== currentUserKey) isAlone = false; });
            if(targetVal !== 'all' && isAlone) return showNeonPopup("⚠️ ليس معك مستخدم آخر داخل الغرفة لإرسال الهدية إليه.");
            if(targetVal === 'all' && isAlone) return showNeonPopup("⚠️ أنت وحدك في الغرفة حالياً.");

            let newSenderPts = myPts - giftPrice;
            userData.points = newSenderPts;
            rtdb.ref(`users/${currentUserKey}`).update({ points: newSenderPts }).then(()=>{
                updateUI();
                toggleGiftBoxPanel();

                let descPart = `${giftPrice} نقطة`;

                if(targetVal === 'all'){
                    rtdb.ref(`room_messages/${activeRoomKey}`).push({
                        isGiftCard: true,
                        senderKey: currentUserKey,
                        senderName: userData.name || 'مستخدم',
                        senderAvatar: userData.avatar || 'https://via.placeholder.com/35',
                        giftEmoji: giftEmoji,
                        giftDesc: descPart,
                        timestamp: Date.now()
                    });
                    showNeonPopup(`✅ تم إرسال الهدية بنجاح.`);
                } else {
                    let recipientShare = Math.floor(giftPrice / 2);
                    rtdb.ref(`users/${targetVal}`).once('value', rSnap=>{
                        if(rSnap.exists()){
                            let rData = rSnap.val();
                            let recipientNewPts = Number(rData.points || 0) + recipientShare;
                            rtdb.ref(`users/${targetVal}`).update({ points: recipientNewPts }).then(()=>{
                                rtdb.ref(`notifications/${targetVal}`).push({
                                    text: `🎁 استلمت هدية من (${userData.name}) وأضيفت (${recipientShare} نقطة) لرصيدك.`,
                                    timestamp: Date.now()
                                });
                                rtdb.ref(`room_messages/${activeRoomKey}`).push({
                                    isGiftCard: true,
                                    senderKey: currentUserKey,
                                    senderName: userData.name || 'مستخدم',
                                    senderAvatar: userData.avatar || 'https://via.placeholder.com/35',
                                    giftEmoji: giftEmoji,
                                    giftDesc: `${descPart} (إلى ${rData.name || 'مستخدم'})`,
                                    timestamp: Date.now()
                                });
                                showNeonPopup(`✅ تم إرسال الهدية بنجاح.`);
                            });
                        }
                    });
                }
            });
        });
    }

    function initLoungeTickerAnimation(){
        const words = ["LOUNGE", "PLATFORM", "VIP"];
        let wIdx = 0, cIdx = 0;
        const el = document.getElementById('loungeTickerWord');
        if(!el) return;
        setInterval(()=>{
            let currentWord = words[wIdx];
            el.innerText = currentWord.substring(0, cIdx + 1);
            cIdx++;
            if(cIdx >= currentWord.length){ cIdx = 0; wIdx = (wIdx + 1) % words.length; }
        }, 800);
    }

    function selectWithdrawMethod(methodName){
        selectedWithdrawMethodName = methodName;
        document.getElementById('wBtnZain').className = "withdraw-method-btn" + (methodName === 'زين كاش (Zain Cash)' ? " active" : "");
        document.getElementById('wBtnSuper').className = "withdraw-method-btn" + (methodName === 'سوبركي (SuperKey)' ? " active" : "");
        document.getElementById('wBtnUsdt').className = "withdraw-method-btn" + (methodName === 'USDT TRC20' ? " active" : "");
        let accInput = document.getElementById('withdrawAccount');
        if(methodName === 'USDT TRC20') accInput.placeholder = "أدخل عنوان محفظة USDT TRC20 الخاصة بك";
        else if(methodName === 'سوبركي (SuperKey)') accInput.placeholder = "أدخل حساب سوبركي الخاص بك";
        else accInput.placeholder = "رقم محفظة زين كاش الخاص بك";
    }

    function openSellCounterModal(){ document.getElementById('sellCounterModal').style.display = 'flex'; }
    function closeSellCounterModal(){ document.getElementById('sellCounterModal').style.display = 'none'; }

    function confirmPublishCounterForSale(){
        let counterVal = parseInt(document.getElementById('sellCounterTypeInput').value);
        let priceVal = parseInt(document.getElementById('sellCounterPriceInput').value);
        if(isNaN(counterVal) || counterVal <= 0 || isNaN(priceVal) || priceVal <= 0) return showNeonPopup("⚠️ يرجى إدخال نوع العداد وسعر البيع بشكل صحيح.");
        if((userData.activeCounterVal || 0) < counterVal) return showNeonPopup(`⚠️ عدادك الحالي أقل من القيمة المطلوبة للبيع.`);

        rtdb.ref('trading_counters').push({
            sellerKey: currentUserKey,
            sellerId: userData.customId || '---',
            counterVal: counterVal,
            price: priceVal,
            timestamp: Date.now()
        }).then(()=>{
            closeSellCounterModal();
            document.getElementById('sellCounterTypeInput').value = '';
            document.getElementById('sellCounterPriceInput').value = '';
            showNeonPopup("✅ تم عرض العداد للبيع في السوق بنجاح.");
        });
    }

    function loadTradingCountersMarket(){
        if(!rtdb) return;
        rtdb.ref('trading_counters').limitToLast(50).once('value', snap=>{
            let container = document.getElementById('tradingCountersListContainer');
            if(!container) return;
            if(!snap.exists()){
                container.innerHTML = "<div style='text-align:center;color:#94a3b8;padding:20px;font-size:11px;'>لا توجد عدادات معروضة للبيع حالياً.</div>";
                return;
            }
            let html = '';
            snap.forEach(item=>{
                let d = item.val(), itemKey = item.key;
                html += `<div style="background:rgba(30,41,59,0.85); border:1px solid rgba(16,185,129,0.4); border-radius:12px; padding:10px; display:flex; justify-content:space-between; align-items:center; text-align:right;">
                    <div style="flex:1;">
                        <div style="font-size:12px; color:#fde047; font-weight:bold;">عداد ${Number(d.counterVal).toLocaleString()} نقطة يومياً</div>
                        <div style="font-size:10px; color:#38bdf8; margin-top:2px;">👤 البائع (ID): ${d.sellerId}</div>
                        <div style="font-size:11px; color:#34d399; font-weight:bold; margin-top:3px;">💰 السعر: ${Number(d.price).toLocaleString()} نقطة</div>
                    </div>
                    <div><button class="action-btn btn-gold" style="padding:6px 12px; font-size:11px;" onclick="promptBuyTradingCounter('${itemKey}', '${d.sellerKey}', ${d.counterVal}, ${d.price})">شراء 🛒</button></div>
                </div>`;
            });
            container.innerHTML = html;
        });
    }

    function promptBuyTradingCounter(itemKey, sellerKey, counterVal, price){
        if(sellerKey === currentUserKey) return showNeonPopup("⚠️ لا يمكنك شراء عدادك المعروض بنفسك.");
        pendingBuyItem = { itemKey, sellerKey, counterVal, price };
        document.getElementById('buyConfirmText').innerText = `هل أنت متأكد من شراء عداد (${counterVal.toLocaleString()} نقطة يومياً) بسعر (${price.toLocaleString()} نقطة)؟`;
        document.getElementById('buyConfirmModal').style.display = 'flex';
    }

    function closeBuyConfirmModal(){ document.getElementById('buyConfirmModal').style.display = 'none'; pendingBuyItem = null; }

    function executeBuyCounterTransaction(){
        if(!pendingBuyItem) return closeBuyConfirmModal();
        let { itemKey, sellerKey, counterVal, price } = pendingBuyItem;
        
        if((userData.points || 0) < price){
            closeBuyConfirmModal();
            return showNeonPopup(`❌ ليس لديك رصيد نقاط كافي لإتمام الشراء.`);
        }
        
        rtdb.ref(`users/${sellerKey}`).once('value', sSnap=>{
            if(!sSnap.exists()){
                closeBuyConfirmModal();
                return showNeonPopup(`❌ عذراً، عارض العداد غير موجود.`);
            }
            let sellerData = sSnap.val();

            rtdb.ref(`trading_counters/${itemKey}`).remove().then(()=>{
                let newBuyerPts = userData.points - price;
                let existingBuyerCounterVal = userData.activeCounterVal || 0;
                let updatedBuyerCounterVal = existingBuyerCounterVal + counterVal;

                rtdb.ref(`users/${currentUserKey}`).update({
                    points: newBuyerPts,
                    activeCounterVal: updatedBuyerCounterVal,
                    activeCounter: `عداد ${updatedBuyerCounterVal.toLocaleString()} نقطة يومياً`
                }).then(()=>{
                    
                    let newSellerPts = Number(sellerData.points || 0) + price;
                    rtdb.ref(`users/${sellerKey}`).update({
                        points: newSellerPts,
                        activeCounterVal: 0,
                        activeCounter: 'لا يوجد'
                    }).then(()=>{
                        
                        rtdb.ref(`notifications/${sellerKey}`).push({
                            text: `🎉 تم بيع عدادك (${counterVal.toLocaleString()} نقطة) بنجاح وأضيفت (${price.toLocaleString()} نقطة) لرصيدك.`,
                            timestamp: Date.now()
                        });
                        
                        closeBuyConfirmModal();
                        updateUI();
                        showNeonPopup(`🎉 تمت عملية الشراء بنجاح.`);
                    });
                });
            });
        });
    }

    function handleUserClickAndWin(){
        if(globalAppSettings.dailyCounterLocked && currentEmail !== 'msaftwtn@gmail.com') return showNeonPopup('⚠️ النظام متوقف مؤقتاً من الإدارة.');
        let btn = document.getElementById('clickAndWinMainBtn');
        if(btn){ btn.classList.remove('click-active-anim'); void btn.offsetWidth; btn.classList.add('click-active-anim'); }
        userData.userClicksCount = (userData.userClicksCount || 0) + 1;
        let currentClicks = userData.userClicksCount, maxTarget = 500000;
        document.getElementById('clickLiveCounterDisplay').innerText = `📈 العداد الحالي: ${currentClicks.toLocaleString()} / ${maxTarget.toLocaleString()}`;
        if(currentClicks >= maxTarget){
            userData.userClicksCount = 0;
            userData.points = (userData.points || 0) + 100;
            userData.gems = (userData.gems || 0) + 100;
            saveToDB().then(()=>{
                updateUI();
                showNeonPopup("🎉 مبروك! أتممت الحد المطلوبة وحصلت على 100 نقطة و 100 جوهرة بنجاح.");
            });
        } else {
            if(clickDebounceTimer) clearTimeout(clickDebounceTimer);
            clickDebounceTimer = setTimeout(()=>{ saveToDB(); }, 600);
        }
    }

    function initDailyQuizSession() {
        if (!currentUserKey) return;
        const todayStr = new Date().toDateString();
        const sessionDateKey = 'lounge_quiz_session_date_' + currentUserKey;
        if (localStorage.getItem(sessionDateKey) !== todayStr) {
            localStorage.setItem(sessionDateKey, todayStr);
            let shuffled = [...fullQuestionsPool].sort(() => Math.random() - 0.5);
            localStorage.setItem('lounge_daily_pool_' + currentUserKey, JSON.stringify(shuffled));
            localStorage.removeItem('lounge_quiz_completed_' + currentUserKey);
        }
        let savedPool = localStorage.getItem('lounge_daily_pool_' + currentUserKey);
        let pool = savedPool ? JSON.parse(savedPool) : [...fullQuestionsPool].sort(() => Math.random() - 0.5);
        currentDailyQuestions = pool.slice(0, 10);
        
        if (localStorage.getItem('lounge_quiz_completed_' + currentUserKey) === todayStr) {
            isCompletedToday = true;
            lockQuizButton("لقد أكملت تحدي الأسئلة اليومي بنجاح.");
        } else {
            isCompletedToday = false; currentQuestionIndex = 0; correctAnswersCount = 0;
            loadNextDailyQuestion();
        }
    }

    function loadNextDailyQuestion() {
        if (isCompletedToday) return;
        if (currentQuestionIndex >= currentDailyQuestions.length) currentQuestionIndex = 0;
        document.getElementById('question-index-text').innerText = (currentQuestionIndex + 1);
        currentQuestion = currentDailyQuestions[currentQuestionIndex];
        const qBox = document.getElementById('question-box');
        if (qBox) qBox.innerText = currentQuestion.q;
        const optionsBox = document.getElementById('options-box');
        if (!optionsBox) return;
        optionsBox.innerHTML = '';
        const isCorrectFirst = Math.random() < 0.5;
        const opts = isCorrectFirst ? 
            [{ text: currentQuestion.correct, isCorrect: true }, { text: currentQuestion.wrong, isCorrect: false }] :
            [{ text: currentQuestion.wrong, isCorrect: false }, { text: currentQuestion.correct, isCorrect: true }];
        opts.forEach((opt) => {
            const btn = document.createElement('button');
            btn.innerText = opt.text;
            btn.style.cssText = "padding:14px; background:rgba(30,41,59,0.85); color:#fff; border:1px solid rgba(168,85,247,0.3); border-radius:10px; cursor:pointer; text-align:center; font-weight:bold; font-size:13px;";
            btn.onclick = () => checkQuizAnswer(opt.isCorrect, btn);
            optionsBox.appendChild(btn);
        });
    }

    function checkQuizAnswer(isCorrect, selectedBtn) {
        if (isCompletedToday) return;
        const allButtons = document.getElementById('options-box').getElementsByTagName('button');
        for (let b of allButtons) b.style.pointerEvents = 'none';
        if (isCorrect) { selectedBtn.style.background = '#22c55e'; correctAnswersCount++; }
        else { selectedBtn.style.background = '#ef4444'; }
        currentQuestionIndex++;
        setTimeout(() => {
            if (currentQuestionIndex >= 10 || currentQuestionIndex >= currentDailyQuestions.length) {
                isCompletedToday = true;
                localStorage.setItem('lounge_quiz_completed_' + currentUserKey, new Date().toDateString());
                rtdb.ref(`users/${currentUserKey}`).update({ points: (userData.points || 0) + 50 }).then(()=>{
                    updateUI();
                    document.getElementById('earned-points').innerText = "50";
                    lockQuizButton("أكملت الـ 10 أسئلة بنجاح. حصلت على 50 نقطة مكافأة.");
                });
            } else { loadNextDailyQuestion(); }
        }, 800);
    }

    function lockQuizButton(message) {
        const actionBtn = document.getElementById('answer-action-btn');
        if (actionBtn) { actionBtn.innerText = message; actionBtn.style.background = '#64748b'; actionBtn.disabled = true; }
        const oBox = document.getElementById('options-box');
        if (oBox) oBox.innerHTML = `<p style="grid-column:span 2; text-align:center; color:#38bdf8; font-weight:bold; font-size:12px; padding:10px;">${message}</p>`;
    }

    function openMemoryGameModal(){
        let now = new Date().getTime();
        let cooldown = 24 * 60 * 60 * 1000;
        let lastTime = userData.lastMemoryGameTime || 0;
        let rem = cooldown - (now - lastTime);

        if(lastTime && rem > 0){
            let h = Math.floor((rem%(1000*60*60*24))/(1000*60*60));
            let m = Math.floor((rem%(1000*60*60))/(1000*60));
            return showNeonPopup(`⚠️ يرجى الانتظار (${h} ساعة و ${m} دقيقة) لتلعب لعبة الذاكرة مجدداً.`);
        }

        document.getElementById('gameModalTitle').innerText = "🧩 لعبة الذاكرة (50 نقطة)";
        let body = document.getElementById('gameModalBodyArea');
        let emojis = ['⭐', '💎', '🚀', '🐱', '🔥', '👑', '🏆', '🎮', '⭐', '💎', '🚀', '🐱', '🔥', '👑', '🏆', '🎮'].sort(()=>Math.random()-0.5);
        let flipped = [], matchedPairs = 0, attempts = 0;
        
        let html = `<div id='memAttempts' style='font-size:11px; color:#38bdf8; margin-bottom:6px;'>المحاولات: 0 | المطابق: 0 / 8</div>
        <div style='display:grid; grid-template-columns:repeat(4, 1fr); gap:5px; width:100%;'>`;
        emojis.forEach((emoji, idx)=>{
            html += `<button class='mem-card-btn' data-emoji='${emoji}' data-idx='${idx}' onclick='flipMemoryCard16(this)' style='height:42px; background:rgba(30,41,59,0.9); border:1px solid #10b981; border-radius:8px; font-size:16px; cursor:pointer;'>❓</button>`;
        });
        html += `</div>`;
        body.innerHTML = html;
        document.getElementById('gameModal').style.display = 'flex';

        window.flipMemoryCard16 = function(btn){
            if(btn.disabled || flipped.length >= 2 || btn.classList.contains('matched')) return;
            btn.innerText = btn.getAttribute('data-emoji');
            btn.style.background = '#10b981';
            flipped.push(btn);
            
            if(flipped.length === 2){
                attempts++;
                document.getElementById('memAttempts').innerText = `المحاولات: ${attempts} | المطابق: ${matchedPairs} / 8`;
                let b1 = flipped[0], b2 = flipped[1];
                if(b1.getAttribute('data-emoji') === b2.getAttribute('data-emoji')){
                    b1.classList.add('matched'); b2.classList.add('matched');
                    flipped = [];
                    matchedPairs++;
                    if(matchedPairs === 8){
                        let nowTime = new Date().getTime();
                        userData.lastMemoryGameTime = nowTime;
                        userData.points = (userData.points || 0) + 50;
                        saveToDB().then(()=>{
                            updateUI();
                            showNeonPopup(`🧩 مبروك! أتممت لعبة الذاكرة وتم منحك 50 نقطة بنجاح.`);
                        });
                    }
                } else {
                    setTimeout(()=>{
                        b1.innerText = '❓'; b1.style.background = 'rgba(30,41,59,0.9)';
                        b2.innerText = '❓'; b2.style.background = 'rgba(30,41,59,0.9)';
                        flipped = [];
                    }, 500);
                }
            }
        };
    }

    function openOutOfOrderGameModal(){
        let now = new Date().getTime();
        let cooldown = 24 * 60 * 60 * 1000;
        let lastTime = userData.lastOutOfOrderTime || 0;
        let rem = cooldown - (now - lastTime);

        if(lastTime && rem > 0){
            let h = Math.floor((rem%(1000*60*60*24))/(1000*60*60));
            let m = Math.floor((rem%(1000*60*60))/(1000*60));
            return showNeonPopup(`⚠️ يرجى الانتظار (${h} ساعة و ${m} دقيقة) لتلعب لعبة (خارج الترتيب) مجدداً.`);
        }

        document.getElementById('gameModalTitle').innerText = "🔢 لعبة خارج الترتيب (50 نقطة)";
        let body = document.getElementById('gameModalBodyArea');
        
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let randomWrongVal = 15;
        let wrongIndex = Math.floor(Math.random() * 8) + 1;
        numbers[wrongIndex] = randomWrongVal;

        let html = `<div style='font-size:11px; color:#f472b6; margin-bottom:8px; text-align:center;'>اعثر على الرقم الخارج عن الترتيب بدقة.</div>
        <div style='display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; width:100%;'>`;
        
        numbers.forEach((num)=>{
            let isWrong = (num === randomWrongVal);
            html += `<button class='oo-btn' data-wrong='${isWrong}' onclick='checkOutOfOrderClick(this)' style='height:45px; background:linear-gradient(135deg, #7e22ce, #a855f7); border:1.5px solid #c084fc; border-radius:10px; font-size:15px; font-weight:bold; color:#fff; cursor:pointer; box-shadow:0 0 10px rgba(168,85,247,0.4);'>${num}</button>`;
        });
        html += `</div>`;
        body.innerHTML = html;
        document.getElementById('gameModal').style.display = 'flex';

        window.checkOutOfOrderClick = function(btn){
            let isWrongNum = btn.getAttribute('data-wrong') === 'true';
            if(isWrongNum){
                btn.style.background = '#10b981';
                btn.style.borderColor = '#34d399';
                let nowTime = new Date().getTime();
                userData.lastOutOfOrderTime = nowTime;
                userData.points = (userData.points || 0) + 50;
                
                saveToDB().then(()=>{
                    updateUI();
                    showNeonPopup("🎉 مبروك! لقد وجدت الرقم الصحيح وتم منحك 50 نقطة بنجاح.");
                    closeGameModal();
                }).catch(err => {
                    showNeonPopup("⚠️ حدث خطأ في حفظ النقاط، يرجى المحاولة مرة أخرى.");
                });
            } else {
                btn.style.background = '#ef4444';
                showNeonPopup("❌ خطأ. حاول التركيز واختيار الرقم المناسب.");
            }
        };
    }

    function closeGameModal(){ document.getElementById('gameModal').style.display = 'none'; }

    function checkAndTriggerDailyCounterNotification(){
        if(!currentUserKey || !userData.lastSpinTime) return;
        let cooldown = 24 * 60 * 60 * 1000;
        let now = new Date().getTime();
        let rem = cooldown - (now - userData.lastSpinTime);
        let notifiedKey = 'lounge_counter_notified_' + currentUserKey + '_' + userData.lastSpinTime;
        if(rem <= 0 && !localStorage.getItem(notifiedKey)){
            localStorage.setItem(notifiedKey, 'true');
            rtdb.ref(`notifications/${currentUserKey}`).push({
                text: "انتهى وقت عدادك. يمكنك تفعيل العداد اليومي الآن.",
                timestamp: Date.now()
            });
        }
    }

    function publishLoungePost(){
        let title = document.getElementById('newPostTitle').value.trim();
        let desc = document.getElementById('newPostText').value.trim();
        let imgFile = document.getElementById('newPostImageInput').files[0];
        
        if(!title && !desc && !imgFile) return showNeonPopup("⚠️ يرجى إدخال محتوى المنشور أو إرفاق صورة.");

        let createPostAction = (imgBase64)=>{
            rtdb.ref('rooms').push({
                isLoungePost: true,
                authorKey: currentUserKey,
                authorName: userData.name || 'مستخدم',
                authorId: userData.customId || '---',
                authorAvatar: userData.avatar || 'https://via.placeholder.com/40',
                title: title,
                text: desc,
                image: imgBase64 || '',
                likesCount: 0,
                likedUsers: {},
                timestamp: Date.now()
            }).then(()=>{
                document.getElementById('newPostTitle').value = '';
                document.getElementById('newPostText').value = '';
                document.getElementById('newPostImageInput').value = '';
                showNeonPopup("✅ تم نشر المنشور بنجاح.");
                loadLoungePosts();
            });
        };

        if(imgFile){
            let reader = new FileReader();
            reader.onload = (e)=> createPostAction(e.target.result);
            reader.readAsDataURL(imgFile);
        } else {
            createPostAction('');
        }
    }

    function loadLoungePosts(){
        if(!rtdb) return;
        rtdb.ref('rooms').limitToLast(50).on('value', snap=>{
            let container = document.getElementById('loungePostsContainer');
            if(!container) return;
            if(!snap.exists()){
                container.innerHTML = "<div style='text-align:center;color:#94a3b8;padding:20px;font-size:11px;'>لا توجد منشورات حالياً.</div>";
                return;
            }
            let html = '';
            snap.forEach(item=>{
                let p = item.val();
                if(!p.isLoungePost) return;
                let pKey = item.key;
                let dateStr = new Date(p.timestamp).toLocaleString();
                let isMyPost = (p.authorKey === currentUserKey);
                let isAdmin = (currentEmail === 'msaftwtn@gmail.com' || userData.customId === '1');
                
                let deleteBtn = (isMyPost || isAdmin) ? 
                    `<button class="action-btn" style="background:#ef4444;color:#fff;padding:2px 6px;font-size:9px;" onclick="deleteLoungePost('${pKey}')">حذف 🗑️</button>` : '';

                let imgHtml = p.image ? `<img src="${p.image}" style="width:100%; max-height:200px; object-fit:cover; border-radius:10px; margin-bottom:6px;" alt="صورة المنشور">` : '';

                html += `<div class="card" style="text-align:right; margin-bottom:8px; background:rgba(20,10,40,0.85);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <img src="${p.authorAvatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:1px solid #c084fc;" alt="صورة">
                            <div>
                                <b style="color:#fff; font-size:12px;">${p.authorName}</b>
                                <div style="font-size:8px; color:#94a3b8;">معرف: ${p.authorId} | ${dateStr}</div>
                            </div>
                        </div>
                        <div>${deleteBtn}</div>
                    </div>
                    ${p.title ? `<div style="font-size:12px; color:#f472b6; font-weight:bold; margin-bottom:4px;">📌 ${p.title}</div>` : ''}
                    ${p.text ? `<div style="font-size:11px; color:#f8fafc; margin-bottom:6px; word-break:break-word;">${p.text}</div>` : ''}
                    ${imgHtml}
                    <div style="display:flex; justify-content:flex-start; align-items:center; font-size:11px; border-top:1px solid rgba(255,255,255,0.08); padding-top:6px;">
                        <button class="action-btn" style="width:auto; background:rgba(168,85,247,0.2); border:1px solid #c084fc; color:#fff; padding:4px 12px; font-size:10px;" onclick="likeLoungePost('${pKey}')">❤️ إعجاب (${p.likesCount || 0})</button>
                    </div>
                </div>`;
            });
            container.innerHTML = html || "<div style='text-align:center;color:#94a3b8;padding:20px;font-size:11px;'>لا توجد منشورات حالياً.</div>";
        });
    }

    function likeLoungePost(postKey){
        if(!currentUserKey) return;
        rtdb.ref(`rooms/${postKey}`).once('value', snap=>{
            if(!snap.exists()) return;
            let post = snap.val();
            let likedUsers = post.likedUsers || {};
            
            if(likedUsers[currentUserKey]){
                return;
            }
            
            likedUsers[currentUserKey] = true;
            let newLikes = (post.likesCount || 0) + 1;
            rtdb.ref(`rooms/${postKey}`).update({ 
                likesCount: newLikes,
                likedUsers: likedUsers
            });
        });
    }

    function deleteLoungePost(postKey){
        if(!confirm("⚠️ هل أنت متأكد من حذف هذا المنشور؟")) return;
        rtdb.ref(`rooms/${postKey}`).remove().then(()=>{
            showNeonPopup("✅ تم الحذف بنجاح.");
            loadLoungePosts();
        });
    }

    function loadMyProfilePosts(){
        rtdb.ref('rooms').orderByChild('authorKey').equalTo(currentUserKey).once('value', snap=>{
            let container = document.getElementById('myProfilePostsContainer');
            if(!container) return;
            if(!snap.exists()){
                container.innerHTML = "<div style='text-align:center;color:#94a3b8;padding:20px;font-size:11px;'>ليس لديك أي منشورات حالياً.</div>";
                return;
            }
            let html = '';
            snap.forEach(item=>{
                let p = item.val();
                if(!p.isLoungePost) return;
                let pKey = item.key;
                let dateStr = new Date(p.timestamp).toLocaleString();
                html += `<div class="card" style="text-align:right; margin-bottom:8px;">
                    <div style="font-size:9px; color:#94a3b8; margin-bottom:4px;">${dateStr}</div>
                    ${p.title ? `<div style="font-size:11px; color:#f472b6; font-weight:bold;">${p.title}</div>` : ''}
                    ${p.text ? `<div style="font-size:11px; color:#fff; margin-bottom:6px;">${p.text}</div>` : ''}
                    <button class="action-btn" style="background:#ef4444; color:#fff; padding:4px; font-size:10px;" onclick="deleteLoungePost('${pKey}'); loadMyProfilePosts();">حذف المنشور 🗑️</button>
                </div>`;
            });
            container.innerHTML = html || "<div style='text-align:center;color:#94a3b8;padding:20px;font-size:11px;'>ليس لديك أي منشورات.</div>";
        });
    }

    window.addEventListener('load',()=>{
        initLoungeTickerAnimation();
        initWindEffectInCircle();
        try{
            const firebaseConfig={
                apiKey: "AIzaSyDTcDrVD2z3PT6WZSUJUtG9GIiIYHIdgSw",
                authDomain: "lounge1-ccb9e.firebaseapp.com",
                databaseURL: "https://lounge1-ccb9e-default-rtdb.europe-west1.firebasedatabase.app",
                projectId: "lounge1-ccb9e",
                storageBucket: "lounge1-ccb9e.appspot.com",
                messagingSenderId: "512029557517",
                appId: "1:512029557517:web:1048209a407bc1cc7a2644",
                measurementId: "G-J2PFLPMLSH"
            };
            if(typeof firebase!=='undefined'&&!firebase.apps.length){
                firebase.initializeApp(firebaseConfig);
                rtdb=firebase.database();
                auth=firebase.auth();
                auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});
            }
        }catch(e){}
        
        setTimeout(()=>{
            if(auth){
                auth.onAuthStateChanged((user)=>{
                    if(user){
                        currentUserKey = user.uid;
                        try{ localStorage.setItem('dinarUserKey', currentUserKey); }catch(e){}
                        initRealtimeSync();
                        navigateTo('mainScreen');
                    } else { navigateTo('authScreen'); }
                });
            } else { navigateTo('authScreen'); }
        }, 300);
    });

    function navigateTo(screenId){
        document.querySelectorAll('.screen-page').forEach(p=>p.classList.remove('active'));
        const t=document.getElementById(screenId);if(t)t.classList.add('active');
        if(screenId==='quizScreen') initDailyQuizSession();
        if(screenId==='friendsScreen') loadFriendSystem();
        if(screenId==='agentsScreen') loadApprovedAgentsList();
        if(screenId==='counterTradingScreen') loadTradingCountersMarket();
        if(screenId==='roomsScreen') loadRoomsList();
        if(screenId==='loungePostsScreen') loadLoungePosts();
        if(screenId==='myProfilePostsScreen') loadMyProfilePosts();
        if(screenId==='profileScreen'){
            let b=document.getElementById('profileBioInput');if(b)document.getElementById('bioCounter').innerText=`${b.value.length} / 60`;
            updateVerificationStatusUI();
        }
        if(screenId==='leaderboardScreen') loadLeaderboardData();
    }

    function openNotificationsPage(){ document.querySelectorAll('.notification-badge').forEach(b=>b.style.display='none');navigateTo('notificationsScreen'); }
    function switchAuthTab(type){
        document.getElementById('loginTabBtn').className="tab-btn "+(type==='login'?"active":"");
        document.getElementById('signupTabBtn').className="tab-btn "+(type==='signup'?"active":"");
        document.getElementById('loginForm').style.display=type==='login'?'block':'none';
        document.getElementById('signupForm').style.display=type==='signup'?'block':'none';
    }
    
    function handleLogin(){
        const email=document.getElementById('loginEmail').value.trim(),pass=document.getElementById('loginPass').value.trim();
        if(!email||!pass)return showNeonPopup("⚠️ يرجى إدخال البريد وكلمة المرور.");if(!auth||!rtdb)return showNeonPopup("❌ خطأ بالاتصال.");
        const btn=document.getElementById('loginBtn');btn.disabled=true;btn.innerText="جاري الدخول...";
        
        auth.signInWithEmailAndPassword(email, pass).then((userCredential)=>{
            btn.disabled=false;btn.innerText="دخول الحساب 🚀";
            currentUserKey = userCredential.user.uid;
            rtdb.ref('users/'+currentUserKey).once('value',snap=>{
                if(snap.exists()){
                    let uDat=snap.val();
                    if(uDat.isBanned && email!=='msaftwtn@gmail.com'){
                        auth.signOut();
                        return showNeonPopup("🚫 تم تجميد أو حظر هذا الحساب.");
                    }
                    currentEmail=email;
                    try{localStorage.setItem('dinarUserKey',currentUserKey);}catch(e){}
                    if(email==='msaftwtn@gmail.com'&&uDat.customId!=='1')rtdb.ref('users/'+currentUserKey).update({customId:'1'});
                    
                    if(email!=='msaftwtn@gmail.com'){
                        let devKey=localStorage.getItem('dinarDeviceUuid');
                        if(!devKey){devKey='dev_'+Math.random().toString(36).substring(2)+Date.now();localStorage.setItem('dinarDeviceUuid',devKey);}
                        rtdb.ref(`device_bindings/${devKey}`).once('value',bSnap=>{
                            if(bSnap.exists()&&bSnap.val().userKey!==currentUserKey){
                                rtdb.ref(`users/${currentUserKey}`).update({isBanned:true});
                                auth.signOut();
                                showNeonPopup("🚫 تم حظر الحساب لاكتشاف استخدام متعدد.");
                                navigateTo('authScreen');
                                return;
                            } else { rtdb.ref(`device_bindings/${devKey}`).set({userKey:currentUserKey}); }
                        });
                    }
                    initRealtimeSync();navigateTo('mainScreen');
                }
            });
        }).catch((error)=>{
            btn.disabled=false;btn.innerText="دخول الحساب 🚀";
            showNeonPopup("❌ خطأ في تسجيل الدخول: " + error.message);
        });
    }

    function handleSignup(){
        const email=document.getElementById('signupEmail').value.trim(),pass=document.getElementById('signupPass').value.trim();
        if(!email||!pass)return showNeonPopup("⚠️ يرجى ملء الخانات المطلوبة.");if(!auth||!rtdb)return showNeonPopup("❌ خطأ بالاتصال.");
        const btn=document.getElementById('signupBtn');btn.disabled=true;btn.innerText="جاري الإنشاء...";
        
        auth.createUserWithEmailAndPassword(email, pass).then((userCredential)=>{
            btn.disabled=false;btn.innerText="تأكيد الحساب ✨";
            currentUserKey = userCredential.user.uid;
            let defaultName=email.split('@')[0],assignedId=(email==='msaftwtn@gmail.com')?'1':Math.floor(100000+Math.random()*900000).toString();
            const newUser={name:defaultName,email:email,password:pass,customId:assignedId,points:0,gems:0,bio:'',lastSpinTime:0,activeCounter:'لا يوجد',activeCounterVal:0,lastWithdrawTime:0,isBanned:false,whatsapp:'',withdrawCount:0,isAgent:false,agentTelegram:'',agentWhatsapp:'',agentBag:0,agentProvince:'',agentAvatar:'',gameWins:0,userClicksCount:0,isVerified:false,verificationPhone:'',verificationStatus:'none',lastMemoryGameTime:0,lastOutOfOrderTime:0};
            rtdb.ref('users/'+currentUserKey).set(newUser).then(()=>{
                currentEmail=email;
                try{localStorage.setItem('dinarUserKey',currentUserKey);}catch(e){}
                if(email!=='msaftwtn@gmail.com'){
                    let devKey=localStorage.getItem('dinarDeviceUuid');
                    if(!devKey){devKey='dev_'+Math.random().toString(36).substring(2)+Date.now();localStorage.setItem('dinarDeviceUuid',devKey);}
                    rtdb.ref(`device_bindings/${devKey}`).set({userKey:currentUserKey});
                }
                initRealtimeSync();navigateTo('mainScreen');
            });
        }).catch((error)=>{
            btn.disabled=false;btn.innerText="تأكيد الحساب ✨";
            showNeonPopup("❌ خطأ في إنشاء الحساب: " + error.message);
        });
    }

    function initRealtimeSync(){
        if(!currentUserKey||!rtdb)return;
        rtdb.ref('users/'+currentUserKey).on('value',snap=>{
            if(snap.exists()){
                userData=snap.val();
                if(userData.isBanned&&currentEmail!=='msaftwtn@gmail.com'){
                    showNeonPopup("🚫 تم تجميد حسابك.");
                    handleLogout();
                    return;
                }
                currentEmail=userData.email||'';
                if(currentEmail==='msaftwtn@gmail.com'&&userData.customId!=='1'){userData.customId='1';rtdb.ref('users/'+currentUserKey).update({customId:'1'});}
                if(!userData.customId||!/^\d+$/.test(userData.customId)){userData.customId=Math.floor(100000+Math.random()*900000).toString();rtdb.ref('users/'+currentUserKey).update({customId:userData.customId});}
                updateUI();checkActiveTimer();checkAndTriggerDailyCounterNotification();
            }
        });
        rtdb.ref('app_settings').on('value',snap=>{
            globalAppSettings=snap.exists()?snap.val():{withdrawLocked:false,dailyCounterLocked:false,tickerText:'أهلاً بكم في منصة Lounge الرسمية.'};
            let tickerElem = document.getElementById('tickerTextDisplay');
            if(tickerElem && globalAppSettings.tickerText) tickerElem.innerText = globalAppSettings.tickerText;
        });
        loadNotifications();loadFriendSystem();
    }

    function updateUI(){
        document.getElementById('userPoints').innerText=userData.points||0;
        document.getElementById('userGems').innerText=userData.gems||0;
        document.getElementById('displayUserId').innerText=`ID: ${userData.customId||'---'}`;
        let pId=document.getElementById('displayUserIdProfile');if(pId)pId.innerText=`ID: ${userData.customId||'---'}`;
        let verifiedIconHtml = userData.isVerified ? `<span class="verified-badge-icon" title="حساب موثق">✔</span>` : '';
        document.getElementById('headerUserName').innerHTML=`${userData.name||'المستخدم'} ${verifiedIconHtml}`;
        document.getElementById('profileNameInput').value=userData.name||'';
        let bioInput=document.getElementById('profileBioInput');
        if(bioInput){bioInput.value=userData.bio||'';document.getElementById('bioCounter').innerText=`${bioInput.value.length} / 60`;}
        let av=userData.avatar?userData.avatar:'https://via.placeholder.com/45';
        document.getElementById('headerUserAvatar').src=av;let avPrev=document.getElementById('avatarPreview');if(avPrev)avPrev.src=av;
        let cVal = userData.activeCounterVal || 0;
        document.getElementById('activeCounterInfo').innerText = cVal > 0 ? `${cVal.toLocaleString()} نقطة يومياً` : (userData.activeCounter || 'لا يوجد');
        let clickDisplay = document.getElementById('clickLiveCounterDisplay');
        if(clickDisplay){ clickDisplay.innerText = `📈 العداد الحالي: ${(userData.userClicksCount || 0).toLocaleString()} / 500,000`; }
        let badgeHtml = '';
        if(userData.isAgent) badgeHtml += ` <span class="badge-tag agent">وكيل معتمد 💼</span>`;
        let hdrBadge = document.getElementById('userHeaderBadgeArea');
        if(hdrBadge) hdrBadge.innerHTML = badgeHtml;
        let prfBadge = document.getElementById('profileBadgeDisplay');
        if(prfBadge) prfBadge.innerHTML = badgeHtml;
        let agentPanel = document.getElementById('agentBagPanel');
        if(agentPanel){
            if(userData.isAgent){
                agentPanel.style.display = 'block';
                document.getElementById('agentBagBalance').innerText = (userData.agentBag||0).toLocaleString();
            } else { agentPanel.style.display = 'none'; }
        }
        let adminBtn=document.getElementById('adminPanelMainBtn');
        if(adminBtn){
            if(currentEmail==='msaftwtn@gmail.com'||userData.customId==='1') adminBtn.style.display='inline-block';
            else adminBtn.style.display='none';
        }
        updateVerificationStatusUI();
    }

    function submitVerificationRequest(){
        let phone = document.getElementById('verificationPhoneInput').value.trim();
        if(!phone) return showNeonPopup("⚠️ يرجى إدخال رقم الهاتف للتوثيق.");
        userData.verificationPhone = phone;
        userData.verificationStatus = 'pending';
        rtdb.ref(`verification_requests/${currentUserKey}`).set({
            userKey: currentUserKey,
            userName: userData.name || 'مستخدم',
            userId: userData.customId || '---',
            phone: phone,
            timestamp: Date.now()
        }).then(()=>{
            saveToDB().then(()=>{
                updateVerificationStatusUI();
                showNeonPopup("✅ تم إرسال طلب التوثيق للإدارة بنجاح.");
            });
        });
    }

    function updateVerificationStatusUI(){
        let statusDisp = document.getElementById('verificationStatusDisplay');
        if(!statusDisp) return;
        if(userData.isVerified){
            statusDisp.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 2px;"><span style="color:#22c55e;font-weight:bold;font-size:11px;">رقم الهاتف: ${userData.verificationPhone || '---'}</span><span><span class="verified-badge-icon">✔</span> <b style="color:#c084fc;font-size:10px;">حساب موثق</b></span></div>`;
        } else if(userData.verificationStatus === 'pending'){
            statusDisp.innerHTML = `<span style="color:#eab308;font-weight:bold">⏳ طلب التوثيق قيد المراجعة...</span>`;
        } else {
            statusDisp.innerHTML = `<div style="font-size:11px;color:#c084fc;font-weight:bold;margin-bottom:4px">🛡️ طلب توثيق الحساب بالعلامة الرسمية:</div><div style="display:flex;gap:4px"><input type="text" id="verificationPhoneInput" class="input-box" placeholder="أدخل رقم الهاتف" style="margin:0;flex:1;padding:7px;font-size:11px"><button class="action-btn btn-purple" style="width:40px;height:34px;padding:0;font-size:14px" onclick="submitVerificationRequest()">✔️</button></div>`;
        }
    }

    function loadAdminVerificationRequests(){
        rtdb.ref('verification_requests').limitToLast(30).once('value', snap=>{
            let c = document.getElementById('adminVerificationRequestsList');
            if(!c) return;
            if(!snap.exists()){ c.innerHTML = "لا توجد طلبات توثيق معلقة."; return; }
            let h = '';
            snap.forEach(req=>{
                let d = req.val();
                h += `<div style="background:rgba(255,255,255,0.03);padding:4px;border-radius:4px;margin-bottom:3px;display:flex;justify-content:space-between;align-items:center"><div><b>${d.userName}</b> (ID: ${d.userId})<br>الرقم: <span style="color:#38bdf8">${d.phone}</span></div><div style="display:flex;gap:2px"><button onclick="adminApproveVerification('${d.userKey}','${req.key}','${d.phone}')" style="background:#10b981;color:#fff;border:none;padding:2px 6px;border-radius:3px;cursor:pointer;font-size:8px">موافقة ✔️</button><button onclick="adminRejectVerification('${d.userKey}','${req.key}')" style="background:#ef4444;color:#fff;border:none;padding:2px 6px;border-radius:3px;cursor:pointer;font-size:8px">رفض ✖</button></div></div>`;
            });
            c.innerHTML = h;
        });
    }

    function adminApproveVerification(targetKey, reqKey, phone){
        rtdb.ref(`users/${targetKey}`).update({ isVerified: true, verificationStatus: 'approved', verificationPhone: phone }).then(()=>{
            rtdb.ref(`notifications/${targetKey}`).push({ text: `🎉 تمت الموافقة على طلب توثيق حسابك بنجاح.`, timestamp: Date.now() });
            rtdb.ref(`verification_requests/${reqKey}`).remove();
            showNeonPopup("✅ تم توثيق الحساب بنجاح.");
            loadAdminVerificationRequests();
        });
    }

    function adminRejectVerification(targetKey, reqKey){
        rtdb.ref(`users/${targetKey}`).update({ verificationStatus: 'rejected' }).then(()=>{
            rtdb.ref(`notifications/${targetKey}`).push({ text: `⚠️ عذراً، تم رفض طلب توثيق الحساب.`, timestamp: Date.now() });
            rtdb.ref(`verification_requests/${reqKey}`).remove();
            showNeonPopup("❌ تم رفض الطلب.");
            loadAdminVerificationRequests();
        });
    }

    function saveToDB(){
        if(!currentUserKey||!rtdb)return Promise.resolve();
        return rtdb.ref('users/'+currentUserKey).update(userData);
    }
    
    function handleLogout(){
        if(timerInterval) clearInterval(timerInterval);
        try{ localStorage.removeItem('dinarUserKey'); }catch(e){}
        if(auth) auth.signOut();
        currentEmail='';currentUserKey='';
        navigateTo('authScreen');
    }
    
    function agentTransferPoints(){
        if(!userData.isAgent) return showNeonPopup("⚠️ غير مسموح.");
        let targetId = document.getElementById('agentChargeTargetId').value.trim();
        let amt = parseInt(document.getElementById('agentChargeAmount').value);
        if(!targetId || isNaN(amt) || amt <= 0) return showNeonPopup("⚠️ أدخل المعرف (ID) وعدد النقاط بشكل صحيح.");
        let currentBag = userData.agentBag || 0;
        if(currentBag < amt) return showNeonPopup(`❌ رصيد الحقيبة غير كافي.`);
        
        rtdb.ref('users').orderByChild('customId').equalTo(targetId).once('value', snap=>{
            if(!snap.exists()) return showNeonPopup("❌ لم يتم العثور على المستخدم.");
            let targetKey = Object.keys(snap.val())[0];
            let targetData = snap.val()[targetKey];
            
            let updatedBag = currentBag - amt;
            rtdb.ref(`users/${currentUserKey}`).update({ agentBag: updatedBag }).then(()=>{
                userData.agentBag = updatedBag;
                let targetNewPoints = Number(targetData.points || 0) + amt;
                rtdb.ref(`users/${targetKey}`).update({ points: targetNewPoints }).then(()=>{
                    rtdb.ref(`notifications/${targetKey}`).push({
                        text: `💼 قام الوكيل (${userData.name}) بشحن ${amt.toLocaleString()} نقطة بحسابك.`,
                        timestamp: Date.now()
                    });
                    document.getElementById('agentChargeTargetId').value = '';
                    document.getElementById('agentChargeAmount').value = '';
                    updateUI();
                    showNeonPopup("✅ تم الشحن بنجاح.");
                });
            });
        });
    }

    function buyCounter(pts,price){
        if((userData.points||0)<price) return showNeonPopup(`❌ رصيدك غير كافي. السعر ${price.toLocaleString()} نقطة.`);
        let newPts = (userData.points||0) - price;
        let existingCounterVal = userData.activeCounterVal || 0;
        let newCounterVal = existingCounterVal + pts;

        rtdb.ref(`users/${currentUserKey}`).update({
            points: newPts,
            activeCounterVal: newCounterVal,
            activeCounter: `عداد ${newCounterVal.toLocaleString()} نقطة يومياً`
        }).then(()=>{
            updateUI();
            showNeonPopup(`🎉 تم الشراء بنجاح. إجمالي إنتاجك (${newCounterVal.toLocaleString()} نقطة يومياً).`);
        });
    }
    
    function submitManualCounterOrder(){
        let ph = document.getElementById('manualCounterPhone').value.trim();
        let det = document.getElementById('manualCounterDetails').value.trim();
        if(!ph || !det) return showNeonPopup("⚠️ يرجى ملء الحقول المطلوبة.");
        rtdb.ref('manual_counter_orders').push({
            userKey: currentUserKey,
            userName: userData.name || 'مستخدم',
            userId: userData.customId || '---',
            paymentMethod: 'USDT TRC20',
            hash: ph,
            details: det,
            timestamp: Date.now(),
            status: 'pending'
        }).then(()=>{
            document.getElementById('manualCounterPhone').value = '';
            document.getElementById('manualCounterDetails').value = '';
            showNeonPopup("✅ تم إرسال الطلب للإدارة بنجاح.");
        });
    }

    function openAgentApplyModal(){ document.getElementById('agentApplyModal').style.display='flex'; }
    function closeAgentApplyModal(){ document.getElementById('agentApplyModal').style.display='none'; }

    function submitAgentApplication(){
        let prov = document.getElementById('agentProvinceInput').value.trim();
        let tg = document.getElementById('agentTelegramInput').value.trim();
        let wa = document.getElementById('agentWhatsappInput').value.trim();
        let aImg = document.getElementById('agentAvatarInput').files[0];
        let hF = document.getElementById('agentHousingFront').files[0];
        let hB = document.getElementById('agentHousingBack').files[0];
        let nF = document.getElementById('agentNationalFront').files[0];
        let nB = document.getElementById('agentNationalBack').files[0];
        
        if(!prov || !tg || !wa || !aImg || !hF || !hB || !nF || !nB) return showNeonPopup("⚠️ يرجى ملء كافة الحقول ورفع المستمسكات المطلوبة.");
        let requiredFee = 6000000;
        if((userData.points || 0) < requiredFee) return showNeonPopup(`❌ رصيدك الحالي لا يكفي. رسوم التقديم هي 6,000,000 نقطة.`);
        
        let rA = new FileReader(), r1 = new FileReader(), r2 = new FileReader(), r3 = new FileReader(), r4 = new FileReader();
        rA.onload = (eA)=>{
            let agentAvatar64 = eA.target.result;
            r1.onload = (e1)=>{
                let hFront64 = e1.target.result;
                r2.onload = (e2)=>{
                    let hBack64 = e2.target.result;
                    r3.onload = (e3)=>{
                        let nFront64 = e3.target.result;
                        r4.onload = (e4)=>{
                            let nBack64 = e4.target.result;
                            
                            let newPoints = (userData.points || 0) - requiredFee;
                            rtdb.ref(`users/${currentUserKey}`).update({ points: newPoints }).then(()=>{
                                userData.points = newPoints;
                                updateUI();
                                
                                rtdb.ref('agent_applications').push({
                                    userKey: currentUserKey, userName: userData.name, userId: userData.customId,
                                    province: prov, telegram: tg, whatsapp: wa, agentAvatar: agentAvatar64,
                                    feePaid: requiredFee, housingFront: hF, housingBack: hB, nationalFront: nF, nationalBack: nB, timestamp: Date.now()
                                }).then(()=>{
                                    closeAgentApplyModal();
                                    showNeonPopup("✅ تم إرسال طلب الوكالة للإدارة بنجاح.");
                                });
                            });
                        };
                        r4.readAsDataURL(nB);
                    };
                    r3.readAsDataURL(nF);
                };
                r2.readAsDataURL(hB);
            };
            r1.readAsDataURL(hF);
        };
        rA.readAsDataURL(aImg);
    }

    function loadApprovedAgentsList(){
        rtdb.ref('users').orderByChild('isAgent').equalTo(true).once('value').then(snap=>{
            let c = document.getElementById('approvedAgentsList'); if(!c) return;
            if(!snap.exists()){ c.innerHTML = "<div style='grid-column:span 2;text-align:center;'>لا توجد وكلاء حالياً</div>"; return; }
            let h = '';
            snap.forEach(u=>{
                let d = u.val();
                let prov = d.agentProvince || 'العراق';
                let av = d.agentAvatar || d.avatar || 'https://via.placeholder.com/45';
                
                let removeAgentBtn = '';
                if(currentEmail === 'msaftwtn@gmail.com' || userData.customId === '1'){
                    removeAgentBtn = `<button class="action-btn" style="background:#ef4444;color:#fff;padding:3px 6px;font-size:9px;margin-top:6px;width:100%;" onclick="adminRemoveAgentStatus('${u.key}', '${d.name}')">إزالة الوكيل (إدارة) 🗑️</button>`;
                }

                h += `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(234,179,8,0.3);padding:6px;border-radius:10px;text-align:right;">
                    <div style="font-size:11px;color:#facc15;font-weight:bold;margin-bottom:4px;">📍 ${prov}</div>
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                        <img src="${av}" style="width:35px;height:35px;border-radius:50%;object-fit:cover;border:1px solid #eab308;" alt="وكيل">
                        <div><b style="color:#fff;font-size:11px">${d.name}</b><div style="font-size:9px;color:#cbd5e1;">⭐ وكيل معتمد</div></div>
                    </div>
                    <div style="font-size:9px;color:#cbd5e1;margin-bottom:2px;">تليجرام: ${d.agentTelegram||'---'} <button class="agent-copy-btn" onclick="copyTextToClipboard('${d.agentTelegram||''}')">📋</button></div>
                    <div style="font-size:9px;color:#cbd5e1;margin-bottom:2px;">واتساب: ${d.agentWhatsapp||'---'} <button class="agent-copy-btn" onclick="copyTextToClipboard('${d.agentWhatsapp||''}')">📋</button></div>
                    ${removeAgentBtn}
                </div>`;
            });
            c.innerHTML = h || "<div style='grid-column:span 2;text-align:center;'>لا توجد وكلاء معتمدون.</div>";
        });
    }

    function adminRemoveAgentStatus(targetUserKey, agentName){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        if(!confirm(`⚠️ هل أنت متأكد من إزالة صفة الوكيل عن (${agentName})؟`)) return;
        rtdb.ref(`users/${targetUserKey}`).update({
            isAgent: false,
            agentTelegram: '',
            agentWhatsapp: '',
            agentBag: 0,
            agentProvince: '',
            agentAvatar: ''
        }).then(()=>{
            rtdb.ref(`notifications/${targetUserKey}`).push({
                text: `⚠️ قامت الإدارة بإزالة صفة وكيل معتمد.`,
                timestamp: Date.now()
            });
            showNeonPopup("✅ تم إزالة الوكيل بنجاح.");
            loadApprovedAgentsList();
        });
    }

    function claimDailyReward(){
        if(globalAppSettings.dailyCounterLocked&&currentEmail!=='msaftwtn@gmail.com') return showNeonPopup('⚠️ العداد اليومي مغلق مؤقتاً.');
        let now=new Date().getTime();if(now-(userData.lastSpinTime||0)<24*60*60*1000)return showNeonPopup('⚠️ العداد مفعل مسبقاً. انتظر انتهاء الوقت.');
        let rPts=userData.activeCounterVal||0;if(rPts<0) rPts=0;
        rtdb.ref(`users/${currentUserKey}`).update({
            points: (userData.points||0) + rPts,
            gems: (userData.gems||0) + 500,
            lastSpinTime: now
        }).then(()=>{
            updateUI();
            checkAndTriggerDailyCounterNotification();
            showNeonPopup(`🎉 تم استلام الأرباح (${rPts.toLocaleString()} نقطة) و 500 جوهرة بنجاح.`);
        });
    }

    function convertGemsToPoints(){
        let currentGems = userData.gems || 0;
        if(currentGems < 5000) return showNeonPopup(`⚠️ رصيدك (${currentGems.toLocaleString()} جوهرة) أقل من الحد الأدنى للاستبدال (5,000 جوهرة).`);
        rtdb.ref(`users/${currentUserKey}`).update({
            gems: currentGems - 5000,
            points: (userData.points || 0) + 100
        }).then(()=>{
            updateUI();
            showNeonPopup('🎉 تم استبدال 5,000 جوهرة بـ 100 نقطة بنجاح.');
        });
    }

    function checkActiveTimer(){ startTimerCountdown(); }
    function startTimerCountdown(){
        if(timerInterval) clearInterval(timerInterval);
        let cooldown=24*60*60*1000,powerBtn=document.getElementById('powerActivateBtn'),display=document.getElementById('timerDisplay');
        timerInterval=setInterval(()=>{
            let now=new Date().getTime(),rem=cooldown-(now-(userData.lastSpinTime||0));
            if(userData.lastSpinTime&&rem>0){
                powerBtn.className="power-btn green-pulse";powerBtn.disabled=true;
                let h=Math.floor((rem%(1000*60*60*24))/(1000*60*60)),m=Math.floor((rem%(1000*60*60))/(1000*60)),s=Math.floor((rem%(1000*60))/1000);
                display.innerText=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            }else{
                display.innerText="24:00:00";powerBtn.className="power-btn red-pulse";powerBtn.disabled=false;clearInterval(timerInterval);
                checkAndTriggerDailyCounterNotification();
            }
        },1000);
    }

    function switchShopTab(tier){
        document.querySelectorAll('.shop-tab-btn').forEach(b=>b.className='shop-tab-btn');
        document.querySelectorAll('.shop-tier-content').forEach(c=>c.classList.remove('active'));
        if(tier==='gold'){document.getElementById('tabGold').className="shop-tab-btn active-gold";document.getElementById('shopGoldContent').classList.add('active');}
        else if(tier==='diamond'){document.getElementById('tabDiamond').className="shop-tab-btn active-diamond";document.getElementById('shopDiamondContent').classList.add('active');}
        else if(tier==='legend'){document.getElementById('tabLegend').className="shop-tab-btn active-legend";document.getElementById('shopLegendContent').classList.add('active');}
    }

    let isSpinning=false;
    function spinWheel(){
        if(isSpinning)return;let msg=document.getElementById('wheelMsg'),spinBtn=document.getElementById('spinBtn');
        if((userData.gems||0)<100)return msg.innerText="❌ رصيد الجواهر غير كافي (يلزم 100 جوهرة).";
        isSpinning=true;spinBtn.disabled=true;
        rtdb.ref(`users/${currentUserKey}`).update({ gems: (userData.gems||0) - 100 }).then(()=>{
            let wheel=document.getElementById('wheelGraphic'),prizes=[0,5,10,15,20,25,50],idx=Math.floor(Math.random()*7),prize=prizes[idx];
            totalWheelDegrees+=3600+(idx*51.4)+25;wheel.style.transform=`rotate(${totalWheelDegrees}deg)`;
            setTimeout(()=>{
                rtdb.ref(`users/${currentUserKey}`).update({ points: (userData.points || 0) + prize }).then(()=>{
                    msg.innerText=`🎉 مبروك! حصلت على ${prize} نقطة.`;
                    isSpinning=false;spinBtn.disabled=false;updateUI();
                });
            },5000);
        });
    }

    function loadLeaderboardData(){
        rtdb.ref('users').orderByChild('userClicksCount').limitToLast(30).once('value',snap=>{
            let c=document.getElementById('leaderboardClickingList');
            if(!snap.exists()){
                if(c) c.innerHTML="<div style='text-align:center;padding:15px;color:#94a3b8'>لا توجد بيانات مسجلة.</div>";
                return;
            }
            let users=[];
            snap.forEach(u=>{
                let d=u.val();
                if((d.userClicksCount||0) > 0){
                    users.push({ key:u.key, name:d.name||'مستخدم', customId:d.customId||'---', avatar:d.avatar||'', clicking:d.userClicksCount||0 });
                }
            });
            renderLeaderboardList('leaderboardClickingList',[...users].sort((a,b)=>b.clicking-a.clicking),'clicking','تفاعل');
        });
    }

    function renderLeaderboardList(id,list,key,unit){
        let c=document.getElementById(id);if(!c)return;
        if(list.length===0){c.innerHTML="<div style='text-align:center;padding:15px;color:#94a3b8'>لا توجد بيانات مسجلة.</div>";return;}
        let html='';list.forEach((it,i)=>{
            let r=i+1,cr=r===1?'👑 ':(r===2?'🥈 ':(r===3?'🥉 ':''));
            html+=`<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:8px;border-radius:10px;margin-bottom:6px;border:1px solid rgba(255,255,255,0.05)"><div style="display:flex;align-items:center;gap:8px"><span style="font-weight:900;font-size:12px;color:#c084fc;width:22px;text-align:center">#${r}</span><img src="${it.avatar||'https://via.placeholder.com/38'}" style="width:38px;height:38px;border-radius:50%;object-fit:cover" alt="صورة"><div><b style="color:#fff;font-size:12px">${cr}${it.name}</b><div style="font-size:10px;color:#94a3b8">ID: ${it.customId}</div></div></div><div style="text-align:left"><span style="color:#34d399;font-weight:bold;font-size:12px">${it[key].toLocaleString()}</span><div style="font-size:9px;color:#94a3b8">${unit}</div></div></div>`;
        });
        c.innerHTML=html;
    }

    function loadNotifications(){
        if(!currentUserKey||!rtdb)return;
        rtdb.ref(`notifications/${currentUserKey}`).limitToLast(20).on('value',snap=>{
            let c=document.getElementById('notificationsContainer'),b=document.getElementById('mainNotificationBadge');if(!c)return;
            if(!snap.exists()){c.innerHTML="لا توجد إشعارات جديدة";if(b)b.style.display='none';return;}
            if(b)b.style.display='block';let html='';
            snap.forEach(n=>{
                html+=`<div class="system-notification-item">
                    <span style="font-size:16px;">🔔</span>
                    <div style="flex:1;font-size:12px;color:#f8fafc;line-height:1.5;">${n.val().text}</div>
                </div>`;
            });
            c.innerHTML=html;
        });
    }

    function clearAllNotifications(){if(!currentUserKey||!rtdb||!confirm("⚠️ مسح جميع الإشعارات؟"))return;rtdb.ref(`notifications/${currentUserKey}`).remove().then(()=>{document.getElementById('notificationsContainer').innerHTML="لا توجد إشعارات جديدة";document.getElementById('mainNotificationBadge').style.display='none';showNeonPopup("🗑️ تم الحذف.");});}
    
    function sendFriendRequest(){
        let sId=document.getElementById('searchIdInput').value.trim(),res=document.getElementById('searchResultArea');
        if(!sId)return res.innerText="⚠️ أدخل المعرف (ID)";
        res.innerText="جاري البحث والإرسال...";
        rtdb.ref('users').orderByChild('customId').equalTo(sId).once('value',snap=>{
            if(!snap.exists())return res.innerText="❌ لم يتم العثور على مستخدم بهذا المعرف";
            let tk = Object.keys(snap.val())[0];
            if(tk===currentUserKey)return res.innerText="⚠️ لا يمكنك إضافة نفسك.";
            rtdb.ref(`friends/${currentUserKey}/${tk}`).once('value',fs=>{
                if(fs.exists())return res.innerText="⚠️ المستخدم مضاف مسبقاً.";
                rtdb.ref(`friend_requests/${tk}/${currentUserKey}`).set({
                    name: userData.name || 'مستخدم', customId: userData.customId || '---', timestamp: Date.now()
                }).then(()=>{ document.getElementById('searchIdInput').value=''; res.innerText="✅ تم إرسال طلب الصداقة بنجاح."; });
            });
        });
    }

    function loadFriendSystem(){
        if(!currentUserKey||!rtdb)return;
        rtdb.ref(`friend_requests/${currentUserKey}`).once('value',snap=>{
            let c=document.getElementById('friendRequestsContainer');if(!c)return;
            if(!snap.exists()){c.innerHTML="لا توجد طلبات صداقة";return;}let h='';
            snap.forEach(req=>{let d=req.val(),sk=req.key;h+=`<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:6px;border-radius:6px;margin-bottom:4px"><span><b>${d.name}</b> (${d.customId})</span><div style="display:flex;gap:4px"><button onclick="acceptFriend('${sk}','${d.name}','${d.customId}')" style="background:#10b981;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer">قبول</button><button onclick="rejectFriend('${sk}')" style="background:#ef4444;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer">رفض</button></div></div>`;});
            c.innerHTML=h;
        });
        rtdb.ref(`friends/${currentUserKey}`).once('value',snap=>{
            let c=document.getElementById('friendsListContainer');if(!c)return;
            if(!snap.exists()){c.innerHTML="لا يوجد أصدقاء مضافون";return;}let h='';
            snap.forEach(f=>{
                let d=f.val(), fk=f.key;
                h+=`<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:6px;border-radius:6px;margin-bottom:4px">
                    <span style="cursor:pointer">🟢 <b>${d.name}</b></span>
                    <div style="display:flex;gap:4px">
                        <button onclick="openChatModal('${fk}','${d.name}')" style="background:#0ea5e9;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer">محادثة 💬</button>
                        <button onclick="removeFriend('${fk}','${d.name}')" style="background:#ef4444;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer" title="حذف الصديق">حذف 🗑️</button>
                    </div>
                </div>`;
            });
            c.innerHTML=h;
        });
    }

    function acceptFriend(sk,sName,sId){
        rtdb.ref(`friends/${currentUserKey}/${sk}`).set({name:sName,customId:sId});
        rtdb.ref(`friends/${sk}/${currentUserKey}`).set({name:userData.name,customId:userData.customId});
        rtdb.ref(`friend_requests/${currentUserKey}/${sk}`).remove().then(()=>{
            loadFriendSystem();
            showNeonPopup('✅ تمت الموافقة وأصبحتم أصدقاء.');
        });
    }

    function rejectFriend(sk){
        rtdb.ref(`friend_requests/${currentUserKey}/${sk}`).remove().then(()=>{ loadFriendSystem(); });
    }

    function removeFriend(friendKey, friendName){
        if(!confirm(`⚠️ هل أنت متأكد من حذف الصديق (${friendName})؟`)) return;
        rtdb.ref(`friends/${currentUserKey}/${friendKey}`).remove().then(()=>{
            rtdb.ref(`friends/${friendKey}/${currentUserKey}`).remove().then(()=>{
                loadFriendSystem();
                showNeonPopup(`✅ تم إزالة الصديق بنجاح.`);
            });
        });
    }

    function clearRequestsList(){rtdb.ref(`friend_requests/${currentUserKey}`).remove().then(()=>{document.getElementById('friendRequestsContainer').innerHTML="لا توجد طلبات صداقة";showNeonPopup('🗑️ تم تنظيف القائمة.');});}
    function clearFriendsDisplayList(){let c=document.getElementById('friendsListContainer');if(c)c.innerHTML="لا يوجد أصدقاء معروضون";}

    function openChatModal(fk,fName){
        activeChatFriendKey=fk;activeChatFriendName=fName;
        document.getElementById('chatTitle').innerText=`${fName} 👤`;
        document.getElementById('chatModal').style.display='flex';
        let chatId=[currentUserKey,fk].sort().join('_');
        rtdb.ref(`chats/${chatId}`).limitToLast(50).on('value',snap=>{
            let a=document.getElementById('chatMessagesArea');if(!a)return;
            if(!snap.exists()){a.innerHTML="ابدأ المحادثة...";return;}let h='';
            snap.forEach(m=>{
                let msg=m.val(),isMe=msg.sender===currentUserKey;
                let bg=isMe?"background:#10b981;color:#fff":"background:#fff;color:#0f172a";
                h+=`<div style="text-align:${isMe?'left':'right'};margin-bottom:5px"><span style="${bg};padding:5px 9px;border-radius:6px;display:inline-block;max-width:85%;word-break:break-word"><b>${msg.senderName || 'مستخدم'}:</b> ${msg.text || ''}</span></div>`;
            });
            a.innerHTML=h;a.scrollTop=a.scrollHeight;
        });
    }

    function closeChatModal(){
        if(activeChatFriendKey){ rtdb.ref(`chats/${[currentUserKey,activeChatFriendKey].sort().join('_')}`).off(); }
        activeChatFriendKey='';activeChatFriendName='';document.getElementById('chatModal').style.display='none';
    }

    function sendChatMessage(){
        let txt=document.getElementById('chatInputMsg').value.trim();if(!txt||!activeChatFriendKey)return;
        let chatId=[currentUserKey,activeChatFriendKey].sort().join('_');
        rtdb.ref(`chats/${chatId}`).push({sender:currentUserKey,senderName:userData.name || 'مستخدم',text:txt,timestamp:Date.now()}).then(()=>{
            document.getElementById('chatInputMsg').value='';
        });
    }

    function triggerImageUpload(){document.getElementById('hiddenImageInput').click();}
    function previewImage(e){const f=e.target.files[0];if(f){const rd=new FileReader();rd.onload=ce=>{base64Image=ce.target.result;document.getElementById('avatarPreview').src=base64Image;};rd.readAsDataURL(f);}}
    function validateBioLength(i){if(i.value.length>60)i.value=i.value.substring(0,60);document.getElementById('bioCounter').innerText=`${i.value.length} / 60`;}

    function saveProfileData(){
        let n=document.getElementById('profileNameInput').value.trim(),b=document.getElementById('profileBioInput').value.trim();
        if(n)userData.name=n;if(b!==undefined)userData.bio=b.substring(0,60);if(base64Image)userData.avatar=base64Image;
        saveToDB().then(()=>{base64Image='';updateUI();showNeonPopup('✅ تم حفظ التعديلات بنجاح.');});
    }

    function openWithdrawModal(){
        if(globalAppSettings.withdrawLocked && currentEmail !== 'msaftwtn@gmail.com') return showNeonPopup('⚠️ خدمة السحب مغلقة مؤقتاً.');
        document.getElementById('withdrawModal').style.display='flex';
    }
    function closeWithdrawModal(){ document.getElementById('withdrawModal').style.display='none'; }
    
    function submitWithdrawal(){
        let acc=document.getElementById('withdrawAccount').value.trim(),amt=parseFloat(document.getElementById('withdrawAmount').value);
        if(!acc||isNaN(amt))return showNeonPopup('⚠️ أدخل رقم الحساب والمبلغ بشكل صحيح.');
        if(amt<30000)return showNeonPopup('⚠️ الحد الأدنى للسحب هو 30,000 نقطة.');
        if((userData.points||0)<amt)return showNeonPopup(`❌ رصيدك غير كافي.`);
        
        let newPoints = (userData.points || 0) - amt;
        rtdb.ref(`users/${currentUserKey}`).update({ points: newPoints }).then(()=>{
            userData.points = newPoints;
            userData.withdrawCount = (userData.withdrawCount || 0) + 1;
            updateUI();
            
            rtdb.ref(`admin_withdrawals`).push({
                userKey: currentUserKey,
                userName: userData.name,
                userId: userData.customId,
                method: selectedWithdrawMethodName,
                account: acc,
                amount: amt,
                timestamp: Date.now(),
                status: 'pending'
            }).then(()=>{
                userData.lastWithdrawTime=Date.now();
                saveToDB().then(()=>{
                    closeWithdrawModal();
                    document.getElementById('withdrawAccount').value = '';
                    document.getElementById('withdrawAmount').value = '';
                    showNeonPopup(`✅ تم إرسال طلب السحب للإدارة بنجاح.`);
                });
            });
        });
    }

    function adminDualChargeDirectPoints(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        let tId = document.getElementById('adminDualTargetId').value.trim();
        let pts = parseInt(document.getElementById('adminDualPointsAmount').value);
        if(!tId || isNaN(pts) || pts <= 0) return showNeonPopup('⚠️ أدخل معرف المستخدم (ID) وعدد النقاط.');
        
        rtdb.ref('users').orderByChild('customId').equalTo(tId).once('value',snap=>{
            if(!snap.exists()) return showNeonPopup('❌ لم يتم العثور على المستخدم.');
            let targetKey = Object.keys(snap.val())[0];
            let userSnapVal = snap.val()[targetKey];
            
            rtdb.ref(`users/${targetKey}`).update({ points: Number(userSnapVal.points || 0) + pts }).then(()=>{
                rtdb.ref(`notifications/${targetKey}`).push({ text: `⚡ قامت الإدارة بشحن ${pts.toLocaleString()} نقطة بحسابك.`, timestamp: Date.now() });
                showNeonPopup(`✅ تم شحن النقاط بنجاح.`);
            });
        });
    }

    function adminDualChargeAgentBag(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        let targetId = document.getElementById('adminDualTargetId').value.trim();
        let amt = parseInt(document.getElementById('adminDualPointsAmount').value);
        if(!targetId || isNaN(amt) || amt <= 0) return showNeonPopup("⚠️ أدخل معرف الوكيل (ID) وعدد النقاط.");
        
        rtdb.ref('users').orderByChild('customId').equalTo(targetId).once('value',snap=>{
            if(!snap.exists()) return showNeonPopup("❌ لم يتم العثور على الوكيل.");
            let targetKey = Object.keys(snap.val())[0];
            let uData = snap.val()[targetKey];
            
            if(!uData.isAgent) return showNeonPopup("⚠️ هذا المستخدم ليس وكيلاً معتمداً.");
            rtdb.ref(`users/${targetKey}`).update({ agentBag: Number(uData.agentBag || 0) + amt }).then(()=>{
                showNeonPopup(`✅ تم شحن حقيبة الوكيل بنجاح.`);
            });
        });
    }

    function adminToggleFreezeUser(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        let tId = document.getElementById('adminFreezeTargetId').value.trim();
        if(!tId) return showNeonPopup("⚠️ أدخل معرف المستخدم (ID).");
        
        rtdb.ref('users').orderByChild('customId').equalTo(tId).once('value',snap=>{
            if(!snap.exists()) return showNeonPopup("❌ لم يتم العثور على المستخدم.");
            let tk = Object.keys(snap.val())[0];
            let us = snap.val()[tk];
            
            let newStatus = !us.isBanned;
            rtdb.ref(`users/${tk}`).update({isBanned: newStatus}).then(()=>showNeonPopup(newStatus ? "🚫 تم التجميد." : "✅ تم إلغاء التجميد."));
        });
    }

    function adminUpdateTicker(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        let txt = document.getElementById('adminTickerInput').value.trim();
        if(!txt) return showNeonPopup("⚠️ أدخل نص الإعلان.");
        rtdb.ref('app_settings').update({tickerText: txt}).then(()=>showNeonPopup("📢 تم نشر الإعلان بنجاح."));
    }

    function openAdminAgentApplications(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        document.getElementById('adminAgentAppsModal').style.display='flex';
        rtdb.ref('agent_applications').limitToLast(20).once('value',snap=>{
            let lst = document.getElementById('adminAgentAppsList');
            if(!snap.exists()){ lst.innerHTML = "لا توجد طلبات وكالة معلقة."; return; }
            let h = '';
            snap.forEach(item=>{
                let d = item.val();
                h += `<div style="background:rgba(255,255,255,0.03);padding:8px;border-radius:8px;margin-bottom:6px">
                    <b>المستخدم:</b> ${d.userName} (${d.userId})<br>
                    <b>المحافظة:</b> ${d.province||''}<br>
                    <b>رسوم الخصم:</b> ${Number(d.feePaid||6000000).toLocaleString()} نقطة<br>
                    <div style="display:flex;gap:4px;margin-top:6px;">
                        <button onclick="adminApproveAgent('${d.userKey}','${d.telegram}','${d.whatsapp}','${d.province||''}','${d.agentAvatar||''}','${item.key}')" style="background:#10b981;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:10px;flex:1;">موافقة ✔️</button>
                        <button onclick="adminRejectAgent('${d.userKey}', ${d.feePaid||6000000}, '${item.key}')" style="background:#ef4444;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:10px;flex:1;">رفض وإعادة النقاط ✖</button>
                    </div>
                </div>`;
            });
            lst.innerHTML = h;
        });
    }
    function closeAdminAgentApplications(){ document.getElementById('adminAgentAppsModal').style.display='none'; }

    function adminApproveAgent(userKey, tg, wa, prov, agentAv, appKey){
        rtdb.ref(`users/${userKey}`).update({ isAgent: true, agentTelegram: tg, agentWhatsapp: wa, agentProvince: prov, agentAvatar: agentAv }).then(()=>{
            rtdb.ref(`notifications/${userKey}`).push({
                text: `🎉 تمت الموافقة على طلب وكالتك المعتمدة.`,
                timestamp: Date.now()
            });
            rtdb.ref(`agent_applications/${appKey}`).remove();
            showNeonPopup("💼 تم تفعيل الوكالة بنجاح.");
            openAdminAgentApplications();
        });
    }

    function adminRejectAgent(userKey, feeAmount, appKey){
        if(!confirm("⚠️ هل أنت متأكد من رفض الطلب وإعادة الرسوم؟")) return;
        rtdb.ref(`users/${userKey}`).once('value', uSnap=>{
            if(!uSnap.exists()) return showNeonPopup("❌ المستخدم غير موجود.");
            let uData = uSnap.val();
            let restoredPoints = Number(uData.points || 0) + Number(feeAmount);
            
            rtdb.ref(`users/${userKey}`).update({ points: restoredPoints }).then(()=>{
                rtdb.ref(`notifications/${userKey}`).push({
                    text: `⚠️ تم رفض طلب وكالتك، وتمت إعادة ${Number(feeAmount).toLocaleString()} نقطة إلى رصيدك.`,
                    timestamp: Date.now()
                });
                rtdb.ref(`agent_applications/${appKey}`).remove().then(()=>{
                    showNeonPopup("❌ تم رفض الطلب وإعادة النقاط للمستخدم.");
                    openAdminAgentApplications();
                });
            });
        });
    }

    function adminInspectUser(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        let tId=document.getElementById('adminInspectIdInput').value.trim();
        let resArea=document.getElementById('adminInspectResult');
        if(!tId)return showNeonPopup('⚠️ أدخل معرف المستخدم (ID).');
        resArea.style.display='block';
        resArea.innerHTML="جاري جلب البيانات...";

        rtdb.ref('users').orderByChild('customId').equalTo(tId).once('value',snap=>{
            if(!snap.exists()){ resArea.innerHTML="❌ لم يتم العثور على مستخدم."; return; }
            let foundKey = Object.keys(snap.val())[0];
            let foundUser = snap.val()[foundKey];
            
            let valNum = foundUser.activeCounterVal || 0;
            let counterDetail = valNum > 0 ? `عداد ${valNum.toLocaleString()} نقطة يومياً` : (foundUser.activeCounter || 'لا يوجد');
            let wCount = foundUser.withdrawCount || 0;

            resArea.innerHTML=`👤 <b>اسم المستخدم:</b> ${foundUser.name || 'بدون اسم'}<br>`+
                              `🪪 <b>معرف المستخدم (ID):</b> ${foundUser.customId || '---'}<br>`+
                              `👑 <b>العداد النشط:</b> <span style="color:#fde047">${counterDetail}</span><br>`+
                              `💸 <b>عدد عمليات السحب:</b> <span style="color:#34d399">${wCount}</span>`;
        });
    }

    function adminToggleWithdrawFeature(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        let ns=!globalAppSettings.withdrawLocked;
        rtdb.ref('app_settings').update({withdrawLocked:ns}).then(()=>showNeonPopup(ns ? '🔒 تم إغلاق السحب.' : '🔓 تم فتح السحب.'));
    }

    function adminToggleDailyCounterFeature(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        let ns=!globalAppSettings.dailyCounterLocked;
        rtdb.ref('app_settings').update({dailyCounterLocked:ns}).then(()=>showNeonPopup(ns?'⏳ تم قفل العداد اليومي.':'⚡ تم فتح العداد اليومي.'));
    }

    function openAdminPanelModal(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح. حساب الإدارة المعتمد هو (msaftwtn@gmail.com - ID: 1)');
        document.getElementById('adminPanelModal').style.display='flex';
        loadAdminData(); loadAdminVerificationRequests();
    }
    function closeAdminPanelModal(){ document.getElementById('adminPanelModal').style.display='none'; }
    
    function openAdminCounterOrders(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return showNeonPopup('⚠️ غير مسموح.');
        document.getElementById('adminCounterOrdersModal').style.display='flex';
        rtdb.ref('manual_counter_orders').limitToLast(20).once('value',snap=>{
            let lst = document.getElementById('adminCounterOrdersList');
            if(!snap.exists()){ lst.innerHTML = "لا توجد طلبات معلقة."; return; }
            let h="";
            snap.forEach(item=>{
                let d = item.val();
                h+=`<div style="background:rgba(255,255,255,0.03);padding:8px;border-radius:8px;margin-bottom:6px">
                    🪪 <b>معرف المستخدم (ID):</b> <span style="color:#38bdf8">${d.userId}</span><br>
                    👑 <b>الطلب:</b> <span style="color:#fde047">${d.details}</span><br>
                    🔑 <b>التحويل (Hash):</b> <span style="color:#34d399;word-break:break-all">${d.hash || '---'}</span>
                    <button onclick="adminDeleteRef('manual_counter_orders','${item.key}')" style="background:#10b981;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;display:block;margin-top:6px;font-size:10px;">تمت الموافقة ✔️</button>
                </div>`;
            });
            lst.innerHTML = h;
        });
    }
    function closeAdminCounterOrders(){ document.getElementById('adminCounterOrdersModal').style.display='none'; }

    function loadAdminData(){
        if(currentEmail !== 'msaftwtn@gmail.com' && userData.customId !== '1') return;
        rtdb.ref('admin_withdrawals').limitToLast(20).once('value',snap=>{
            let a=document.getElementById('adminWithdrawalsArea');
            if(!snap.exists()){ if(a) a.innerHTML="لا توجد طلبات سحب معلقة."; return; }
            let h='';
            snap.forEach(item=>{
                let d=item.val();
                h+=`<div style="background:rgba(255,255,255,0.04);padding:8px;border-radius:6px;margin-bottom:5px;border:1px solid rgba(192,132,252,0.2)">
                    🪪 <b>معرف المستخدم (ID):</b> <span style="color:#38bdf8">${d.userId}</span><br>
                    💰 <b>المبلغ:</b> <span style="color:#34d399">${Number(d.amount).toLocaleString()} نقطة</span><br>
                    💳 <b>الطريقة:</b> <span style="color:#c084fc">${d.method}</span><br>
                    📱 <b>الحساب:</b> <b style="color:#fde047">${d.account}</b>
                    <div style="display:flex;gap:4px;margin-top:6px;">
                        <button onclick="adminApproveWithdrawal('${item.key}', '${d.userKey}', '${d.userName||'مستخدم'}', ${d.amount})" style="background:#10b981;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:10px;flex:1;">موافقة ✔️</button>
                        <button onclick="adminRejectWithdrawal('${item.key}', '${d.userKey}', ${d.amount})" style="background:#ef4444;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:10px;flex:1;">رفض وإعادة النقاط ✖</button>
                    </div>
                </div>`;
            });
            if(a) a.innerHTML=h;
        });
    }

    function adminApproveWithdrawal(reqKey, userKey, userName, amount){
        rtdb.ref(`notifications/${userKey}`).push({
            text: `تمت الموافقة على طلب سحب الأرباح بقيمة (${Number(amount).toLocaleString()} نقطة).`,
            timestamp: Date.now()
        });
        rtdb.ref(`admin_withdrawals/${reqKey}`).remove().then(()=>{
            showNeonPopup("✅ تم تأكيد إتمام السحب.");
            loadAdminData();
        });
    }

    function adminRejectWithdrawal(reqKey, userKey, amount){
        if(!confirm(`⚠️ هل أنت متأكد من رفض الطلب وإعادة (${Number(amount).toLocaleString()} نقطة) للمستخدم؟`)) return;
        rtdb.ref(`users/${userKey}`).once('value', uSnap=>{
            if(!uSnap.exists()) return showNeonPopup("❌ المستخدم غير موجود.");
            let uData = uSnap.val();
            let restoredPoints = Number(uData.points || 0) + Number(amount);
            
            rtdb.ref(`users/${userKey}`).update({ points: restoredPoints }).then(()=>{
                rtdb.ref(`notifications/${userKey}`).push({
                    text: `⚠️ تم رفض طلب سحب الأرباح وتمت إعادة ${Number(amount).toLocaleString()} نقطة إلى رصيدك.`,
                    timestamp: Date.now()
                });
                rtdb.ref(`admin_withdrawals/${reqKey}`).remove().then(()=>{
                    showNeonPopup("❌ تم رفض الطلب وإعادة النقاط.");
                    loadAdminData();
                });
            });
        });
    }

    function adminDeleteRef(path,key){
        rtdb.ref(`${path}/${key}`).remove().then(()=>{
            showNeonPopup("✅ تم بنجاح.");
            if(path==='admin_withdrawals') loadAdminData();
            if(path==='manual_counter_orders') openAdminCounterOrders();
            if(path==='agent_applications') openAdminAgentApplications();
        });
    }
