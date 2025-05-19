import { Injectable } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService {
  client: Client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
  });

  constructor() {
    this.WhatsappInit();
  }

  async create() {
    await this.sendMessage('', 'Testando bruno');
    return 'This action adds a new whatsapp';
  }

  async findAll() {
    await this.sendMessage('', 'Testando bruno');
    return `This action returns all whatsapp`;
  }

  async WhatsappInit() {
    this.client.on('message_create', message => {
      if (message.body === 'Ping') {
        console.log('User phone: ', message.from);
        message.reply('pong');
      }

      if (message.body === 'Mensagem') {
        console.log('User phone: ', message.from);
        this.sendMessage('', 'Testando bruno');
      }
    });
    
    this.client.on('qr', qr => {
      qrcode.generate(qr, {small: true});
  });
    
    this.client.on('ready', () => {
      console.log('Client is ready!');
    });

    await this.client.initialize();
  }

  async sendMessage(to: string, message: string) {
    const phoneTest = '558193527680@c.us'
    await this.client.sendMessage(phoneTest, message);
  }
}
