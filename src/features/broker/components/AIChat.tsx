import React, { useState, useRef, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectBuilding, selectFloors } from '../../../store/selectors';
import { RootState } from '../../../store';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const building = useSelector(selectBuilding);
  const floors = useSelector(selectFloors);
  const viewingReservations = useSelector((state: RootState) => state.viewingReservations.reservations);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      // 初回開封時の挨拶メッセージ
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `こんにちは！${building?.info?.name}のAIアシスタントです。\n\n以下のような質問にお答えできます：\n・物件詳細（賃料、面積、設備など）\n・内見予約について\n・最寄り駅や周辺情報\n・入居手続きについて\n\nお気軽にお聞きください！`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [open, building?.info?.name, messages.length]);

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // キーワードベースの回答システム
    const responses: { [key: string]: string } = {
      // 挨拶・基本
      'こんにちは': 'こんにちは！何かご質問はありますか？',
      'ありがとう': 'どういたしまして！他にも何かご不明な点があれば、お気軽にお聞きください。',
      'はじめまして': `はじめまして！${building?.info?.name}へようこそ。物件についてご案内いたします。`,
      
      // 物件情報
      '賃料': `空室の賃料情報をお答えします。\n\n5階: ¥380,000/月（共益費: ¥40,000）\n6階: ¥380,000/月（共益費: ¥40,000）\n\n詳細な条件については、お気軽にお問い合わせください。`,
      '家賃': `空室の賃料情報をお答えします。\n\n5階: ¥380,000/月（共益費: ¥40,000）\n6階: ¥380,000/月（共益費: ¥40,000）\n\n詳細な条件については、お気軽にお問い合わせください。`,
      '面積': `各階の面積は120㎡です。\n\n現在空室：\n・5階: 120㎡\n・6階: 120㎡\n\nレイアウトや詳細図面については内見時にご確認いただけます。`,
      '広さ': `各階の面積は120㎡です。\n\n現在空室：\n・5階: 120㎡\n・6階: 120㎡\n\nレイアウトや詳細図面については内見時にご確認いただけます。`,
      '坪数': '各階約36坪（120㎡）の広さです。オフィスレイアウトにゆとりを持って設計できます。',
      
      // 空室・入居
      '空室': `現在の空室状況：\n\n・5階: 空室（120㎡）\n・6階: 空室（120㎡）\n\nいずれも即入居可能です。内見のご希望があればお申し付けください。`,
      '空き': `現在の空室状況：\n\n・5階: 空室（120㎡）\n・6階: 空室（120㎡）\n\nいずれも即入居可能です。内見のご希望があればお申し付けください。`,
      '入居': '入居時期については即入居可能です。契約手続きには通常1-2週間程度かかります。審査等の詳細については担当者にお問い合わせください。',
      
      // 設備・施設
      '設備': `${building?.info?.name}の主要設備：\n\n${building?.info?.facilities?.map((f: string, i: number) => `・${f}`).join('\n')}\n\n詳細については内見時にご確認いただけます。`,
      '施設': `${building?.info?.name}の主要設備：\n\n${building?.info?.facilities?.map((f: string, i: number) => `・${f}`).join('\n')}\n\n詳細については内見時にご確認いただけます。`,
      'エレベーター': `エレベーターは1基設置されており、24時間利用可能です。\n\n各階への直接アクセスが可能で、荷物の搬入出にも便利です。`,
      '駐車場': '駐車場は月極で利用可能です（別途料金）。空き状況や料金については、担当者にお問い合わせください。',
      '空調': 'セントラル空調システムを採用しており、各フロアで温度調整が可能です。快適なオフィス環境を保てます。',
      
      // 立地・アクセス
      '駅': `アクセス情報：\n\n${building?.info?.access?.map((a: string, i: number) => `・${a}`).join('\n')}\n\n都心部へのアクセスが非常に便利です。`,
      'アクセス': `アクセス情報：\n\n${building?.info?.access?.map((a: string, i: number) => `・${a}`).join('\n')}\n\n都心部へのアクセスが非常に便利です。`,
      '新橋': 'JR新橋駅から徒歩5分の好立地です。銀座線、山手線、京浜東北線、東海道線がご利用いただけます。',
      '周辺': `周辺環境：\n\n${Object.entries(building?.info?.nearbyInfo || {}).map(([key, value]) => `・${key}: ${value}`).join('\n')}\n\nビジネスに必要な施設が徒歩圏内に揃っています。`,
      
      // 内見・見学
      '内見': '内見をご希望の場合は、内見予約フォームからお申し込みいただけます。営業時間内（9:00-18:00）でご都合の良い日時をお選びください。',
      '見学': '見学をご希望の場合は、内見予約フォームからお申し込みいただけます。営業時間内（9:00-18:00）でご都合の良い日時をお選びください。',
      '予約': '内見予約は専用フォームから承っております。ご希望の階数と日時をお選びいただければ、調整いたします。',
      
      // 契約・手続き
      '契約': '契約期間は2年間が基本です。敷金・礼金等の詳細条件については、物件ごとに設定されております。',
      '敷金': '敷金は賃料2ヶ月分が基本です。詳細は各物件の条件をご確認ください。',
      '礼金': '礼金は賃料1ヶ月分が基本です。詳細は各物件の条件をご確認ください。',
      '審査': '入居審査には通常3-7営業日程度かかります。必要書類等については担当者からご案内いたします。',
      
      // その他
      'ペット': '残念ながら、ペットの飼育は禁止されております。ご了承ください。',
      '喫煙': '館内は全館禁煙です。喫煙は指定の喫煙エリアでお願いします。',
      '営業時間': '営業時間は平日9:00-18:00です。土日祝日は事前予約制となります。',
      '連絡': 'お問い合わせは営業時間内にお電話いただくか、内見予約フォームからご連絡ください。',
      
      // エラー・その他
      'help': '以下のキーワードでお答えできます：\n・賃料、家賃\n・面積、広さ、坪数\n・空室、空き\n・設備、施設\n・アクセス、駅\n・内見、見学、予約\n・契約、敷金、礼金\n\nその他ご不明な点があれば、担当者にお問い合わせください。',
    };

    // キーワードマッチング
    for (const [keyword, response] of Object.entries(responses)) {
      if (input.includes(keyword)) {
        return response;
      }
    }

    // 数字が含まれている場合の階数情報
    if (input.match(/[5-6]/)) {
      const floorNum = input.match(/[5-6]/)?.[0];
      return `${floorNum}階についてお答えします。\n\n・面積: 120㎡\n・賃料: ¥380,000/月\n・共益費: ¥40,000/月\n・現在空室中\n\n内見のご予約も承っております。`;
    }

    // デフォルト回答
    return `申し訳ございません。その件についてはお答えできませんが、以下の担当者にお問い合わせください。\n\n【お問い合わせ】\n・内見予約: 専用フォームから\n・その他: 営業時間内にお電話\n\nまた「help」と入力いただければ、回答可能なキーワードをご案内します。`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // ユーザーメッセージを追加
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // AIの返答を生成（少し遅延を追加してリアル感を演出）
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2秒のランダム遅延
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    '空室状況を教えて',
    '賃料はいくらですか？',
    '内見予約をしたい',
    '最寄り駅からの距離は？',
    '設備について教えて'
  ];

  return (
    <>
      {/* フローティングアクションボタン */}
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          boxShadow: 3,
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s ease-in-out',
          },
        }}
      >
        <ChatIcon />
      </Fab>

      {/* チャットダイアログ */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: 600,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <AIIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">AIアシスタント</Typography>
              <Typography variant="body2" color="text.secondary">
                {building?.info?.name}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
          {/* メッセージ表示エリア */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  {message.sender === 'ai' && (
                    <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
                      <AIIcon fontSize="small" />
                    </Avatar>
                  )}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}
                    >
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.7,
                        display: 'block',
                        mt: 0.5,
                        fontSize: '0.7rem',
                      }}
                    >
                      {message.timestamp.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                  {message.sender === 'user' && (
                    <Avatar sx={{ bgcolor: 'primary.light', width: 24, height: 24 }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Paper>
              </Box>
            ))}

            {isTyping && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
                    <AIIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    AIが回答を準備中...
                  </Typography>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* 推奨質問 */}
          {messages.length <= 1 && (
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                よくある質問:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {suggestedQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    variant="outlined"
                    size="small"
                    onClick={() => setInputText(question)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* 入力エリア */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              gap: 1,
              alignItems: 'flex-end',
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="メッセージを入力してください..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: 'grey.300',
                  color: 'grey.500',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIChat;