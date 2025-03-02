// 轮播图功能
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

document.querySelector('.next').addEventListener('click', () => showSlide(currentSlide + 1));
document.querySelector('.prev').addEventListener('click', () => showSlide(currentSlide - 1));

// 自动轮播
setInterval(() => showSlide(currentSlide + 1), 5000);

// AI助手功能
const aiToggle = document.querySelector('.ai-toggle');
const chatWindow = document.querySelector('.chat-window');
const closeChat = document.querySelector('.close-chat');
const chatInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.send-message');
const chatMessages = document.querySelector('.chat-messages');

// 初始化聊天历史
let messageHistory = [
    {"role": "system", "content": "你是一个友好的AI助手，可以帮助访客了解网站主人。"}
];

aiToggle.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
});

closeChat.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

async function callDeepSeekAPI(messages) {
    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-52413e7c20a0496bbbefc5fb845feccf'
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: messages,
                stream: false
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API调用错误:', error);
        return '抱歉，我现在无法回应，请稍后再试。';
    }
}

function addMessageToChat(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // 添加用户消息到界面
        addMessageToChat(message, true);
        
        // 添加用户消息到历史记录
        messageHistory.push({"role": "user", "content": message});
        
        // 清空输入框
        chatInput.value = '';
        
        // 显示加载状态
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message';
        loadingDiv.textContent = '正在思考...';
        chatMessages.appendChild(loadingDiv);

        // 调用API获取回复
        const response = await callDeepSeekAPI(messageHistory);
        
        // 移除加载状态
        chatMessages.removeChild(loadingDiv);
        
        // 添加AI回复到界面
        addMessageToChat(response, false);
        
        // 添加AI回复到历史记录
        messageHistory.push({"role": "assistant", "content": response});
    }
}

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
}); 