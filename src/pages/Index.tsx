import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const GAMES = [
  { id: 1, title: 'Cyber Nexus 2077', genre: 'RPG', price: 2499, rating: 9.5, discount: 30, image: '🎮', description: 'Футуристическая RPG в неоновом мегаполисе' },
  { id: 2, title: 'Shadow Legends', genre: 'Action', price: 1999, rating: 9.2, discount: 0, image: '⚔️', description: 'Эпическая боевая система' },
  { id: 3, title: 'Space Frontier', genre: 'Strategy', price: 1499, rating: 8.8, discount: 50, image: '🚀', description: 'Покоряй галактику' },
  { id: 4, title: 'Racing Velocity', genre: 'Racing', price: 999, rating: 8.5, discount: 25, image: '🏎️', description: 'Гонки на скорости света' },
  { id: 5, title: 'Mystery Manor', genre: 'Adventure', price: 799, rating: 9.0, discount: 0, image: '🏰', description: 'Разгадай тайну старого поместья' },
  { id: 6, title: 'Battle Royale Pro', genre: 'Shooter', price: 0, rating: 8.9, discount: 0, image: '🎯', description: 'Free-to-play королевская битва' },
];

const PROMO_CODES = [
  { code: 'GAME50', discount: 50, description: 'Скидка 50% на первую покупку' },
  { code: 'WEEKEND30', discount: 30, description: 'Выходная распродажа' },
  { code: 'VIP20', discount: 20, description: 'VIP скидка для постоянных клиентов' },
];

export default function Index() {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [balance, setBalance] = useState(5000);
  const [promoCode, setPromoCode] = useState('');
  const [cart, setCart] = useState<typeof GAMES>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: 'Здравствуйте! Чем могу помочь?', from: 'support' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const filteredGames = GAMES.filter(game => {
    const matchesGenre = selectedGenre === 'all' || game.genre === selectedGenre;
    const matchesPrice = priceFilter === 'all' || 
      (priceFilter === 'free' && game.price === 0) ||
      (priceFilter === 'low' && game.price > 0 && game.price < 1000) ||
      (priceFilter === 'mid' && game.price >= 1000 && game.price < 2000) ||
      (priceFilter === 'high' && game.price >= 2000);
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesPrice && matchesSearch;
  });

  const handleTopUp = (amount: number) => {
    setBalance(prev => prev + amount);
    toast.success(`Баланс пополнен на ${amount} ₽`);
  };

  const handleApplyPromo = () => {
    const promo = PROMO_CODES.find(p => p.code === promoCode.toUpperCase());
    if (promo) {
      toast.success(`Промокод применён! Скидка ${promo.discount}%`);
      setPromoCode('');
    } else {
      toast.error('Неверный промокод');
    }
  };

  const handleBuyGame = (game: typeof GAMES[0]) => {
    const finalPrice = game.price - (game.price * game.discount / 100);
    if (balance >= finalPrice) {
      setBalance(prev => prev - finalPrice);
      toast.success(`${game.title} куплена за ${finalPrice} ₽`);
    } else {
      toast.error('Недостаточно средств');
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, { text: chatInput, from: 'user' }]);
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: 'Спасибо за обращение! Наш специалист свяжется с вами в течение 5 минут.',
          from: 'support'
        }]);
      }, 1000);
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GameStore
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <Icon name="Wallet" size={20} className="text-primary" />
              <span className="font-bold text-lg">{balance} ₽</span>
            </div>
            
            <Dialog open={chatOpen} onOpenChange={setChatOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="MessageCircle" size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-glow" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Icon name="Headphones" size={24} className="text-primary" />
                    Поддержка 24/7
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="h-[300px] overflow-y-auto space-y-3 p-4 bg-muted rounded-lg">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          msg.from === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-card border border-border'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Ваше сообщение..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Icon name="Send" size={18} />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Icon name="User" size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Icon name="User" size={24} className="text-primary" />
                    Профиль игрока
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-3xl">
                      🎮
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Pro_Gamer_2024</h3>
                      <p className="text-sm text-muted-foreground">Уровень 25 • VIP</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Статистика</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">12</div>
                        <div className="text-sm text-muted-foreground">Игр куплено</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-secondary">156ч</div>
                        <div className="text-sm text-muted-foreground">Время игры</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">История покупок</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {['Cyber Nexus 2077', 'Shadow Legends', 'Space Frontier'].map((game, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{game}</span>
                          <Badge variant="outline">Куплено</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="catalog" className="space-y-8">
          <TabsList className="grid w-full max-w-[600px] mx-auto grid-cols-3">
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Icon name="Gamepad2" size={18} />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Icon name="Wallet" size={18} />
              Кошелёк
            </TabsTrigger>
            <TabsTrigger value="promo" className="flex items-center gap-2">
              <Icon name="Ticket" size={18} />
              Промокоды
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
              <Input 
                placeholder="Поиск игр..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Жанр" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все жанры</SelectItem>
                  <SelectItem value="RPG">RPG</SelectItem>
                  <SelectItem value="Action">Action</SelectItem>
                  <SelectItem value="Strategy">Strategy</SelectItem>
                  <SelectItem value="Racing">Racing</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Shooter">Shooter</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Цена" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любая цена</SelectItem>
                  <SelectItem value="free">Бесплатно</SelectItem>
                  <SelectItem value="low">До 1000 ₽</SelectItem>
                  <SelectItem value="mid">1000-2000 ₽</SelectItem>
                  <SelectItem value="high">От 2000 ₽</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => {
                const finalPrice = game.price - (game.price * game.discount / 100);
                return (
                  <Card key={game.id} className="group hover:border-primary transition-all duration-300 overflow-hidden">
                    <CardHeader className="relative">
                      <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                        {game.image}
                      </div>
                      {game.discount > 0 && (
                        <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground animate-glow">
                          -{game.discount}%
                        </Badge>
                      )}
                      <CardTitle className="text-xl">{game.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{game.genre}</Badge>
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-bold">{game.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{game.description}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {game.discount > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            {game.price} ₽
                          </span>
                        )}
                        <span className="text-2xl font-bold text-primary">
                          {game.price === 0 ? 'FREE' : `${finalPrice} ₽`}
                        </span>
                      </div>
                      <Button 
                        onClick={() => handleBuyGame(game)}
                        disabled={game.price > 0 && balance < finalPrice}
                        className="group-hover:scale-105 transition-transform"
                      >
                        {game.price === 0 ? 'Играть' : 'Купить'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-12">
                <Icon name="GamepadIcon" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Игры не найдены</h3>
                <p className="text-muted-foreground">Попробуйте изменить фильтры</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Wallet" size={24} className="text-primary" />
                  Пополнение кошелька
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-8 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Текущий баланс</div>
                  <div className="text-5xl font-bold text-primary mb-4">{balance} ₽</div>
                  <Badge variant="outline" className="text-sm">VIP статус активен</Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Выберите сумму пополнения</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[500, 1000, 2000, 3000, 5000, 10000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/10"
                        onClick={() => handleTopUp(amount)}
                      >
                        <Icon name="Plus" size={24} />
                        <span className="text-2xl font-bold">{amount} ₽</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" size={20} className="text-primary mt-1" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Бонусы при пополнении:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• От 1000 ₽ — +5% бонусом</li>
                        <li>• От 5000 ₽ — +10% бонусом</li>
                        <li>• От 10000 ₽ — +15% бонусом</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promo" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Ticket" size={24} className="text-accent" />
                  Промокоды и скидки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Введите промокод..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 uppercase"
                  />
                  <Button onClick={handleApplyPromo} className="min-w-[120px]">
                    Применить
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Доступные промокоды</h3>
                  <div className="grid gap-4">
                    {PROMO_CODES.map((promo) => (
                      <div 
                        key={promo.code}
                        className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                        onClick={() => setPromoCode(promo.code)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-accent text-accent-foreground font-mono text-base px-3 py-1">
                              {promo.code}
                            </Badge>
                            <Badge variant="outline" className="text-lg font-bold">
                              -{promo.discount}%
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Icon name="Copy" size={16} />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{promo.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">🎁</div>
                    <div>
                      <h3 className="text-xl font-bold">Специальное предложение!</h3>
                      <p className="text-sm text-muted-foreground">Только для новых игроков</p>
                    </div>
                  </div>
                  <p className="mb-4">Получите скидку 50% на первую покупку игры из категории RPG</p>
                  <Button className="w-full" size="lg">
                    Активировать предложение
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border py-8 mt-16">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 GameStore. Самые горячие игры по лучшим ценам 🎮
          </p>
        </div>
      </footer>
    </div>
  );
}
