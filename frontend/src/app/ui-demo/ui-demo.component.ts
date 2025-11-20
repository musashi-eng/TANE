import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHeart, 
  faUser, 
  faEnvelope,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { 
  faHeart as faHeartRegular,
  faCircle
} from '@fortawesome/free-regular-svg-icons';
import { 
  faGithub, 
  faTwitter,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';

interface TableData {
  id: number;
  name: string;
  status: string;
  priority: string;
}

@Component({
  selector: 'app-ui-demo',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    FontAwesomeModule
  ],
  templateUrl: './ui-demo.component.html',
  styleUrls: ['./ui-demo.component.less']
})
export class UiDemoComponent {
  // FontAwesome Solid Icons
  faHeart = faHeart;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faCheck = faCheck;
  faTimes = faTimes;
  
  // FontAwesome Regular Icons
  faHeartRegular = faHeartRegular;
  faCircle = faCircle;
  
  // FontAwesome Brands Icons
  faGithub = faGithub;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  
  // Signals for state management
  userName = signal('');
  email = signal('');
  isLoading = signal(false);
  
  tableData = signal<TableData[]>([
    { id: 1, name: 'タスク1', status: '進行中', priority: '高' },
    { id: 2, name: 'タスク2', status: '完了', priority: '中' },
    { id: 3, name: 'タスク3', status: '未着手', priority: '低' }
  ]);
  
  // メソッド
  handleSubmit() {
    this.isLoading.set(true);
    console.log('ユーザー名:', this.userName());
    console.log('メール:', this.email());
    
    // 模擬的な非同期処理
    setTimeout(() => {
      this.isLoading.set(false);
      alert('送信完了！');
    }, 1000);
  }
  
  handleButtonClick(type: string) {
    console.log(`${type}ボタンがクリックされました`);
  }
}
