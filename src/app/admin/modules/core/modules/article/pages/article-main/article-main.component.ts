import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/admin/view-models';

@Component({
  selector: 'app-article-main',
  templateUrl: './article-main.component.html',
  styleUrls: ['./article-main.component.scss']
})
export class ArticleMainComponent implements OnInit {
  
  listOfArticle: Article[] = [
    {
      title: 'ant design part',
      description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      date: '',
      originalUrl: 'https://www.24h.com.vn/bong-da/psg-thua-man-city-mang-tieng-cay-cu-bo-bong-da-nguoi-dang-phai-an-4-the-do-c48a1249291.html',
      content: 'We supply a series of design principles, practical patterns and high quality design resources ' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
    },
    {
      title: 'ant design part',
      description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      date: '',
      originalUrl: 'https://www.24h.com.vn/bong-da/psg-thua-man-city-mang-tieng-cay-cu-bo-bong-da-nguoi-dang-phai-an-4-the-do-c48a1249291.html',
      content: 'We supply a series of design principles, practical patterns and high quality design resources ' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
    },
    {
      title: 'ant design part',
      description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      date: '',
      originalUrl: 'https://www.24h.com.vn/bong-da/psg-thua-man-city-mang-tieng-cay-cu-bo-bong-da-nguoi-dang-phai-an-4-the-do-c48a1249291.html',
      content: 'We supply a series of design principles, practical patterns and high quality design resources ' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
    },
    {
      title: 'ant design part',
      description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      date: '',
      originalUrl: 'https://www.24h.com.vn/bong-da/psg-thua-man-city-mang-tieng-cay-cu-bo-bong-da-nguoi-dang-phai-an-4-the-do-c48a1249291.html',
      content: 'We supply a series of design principles, practical patterns and high quality design resources ' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
    },
    {
      title: 'ant design part',
      description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      date: '',
      originalUrl: 'https://www.24h.com.vn/bong-da/psg-thua-man-city-mang-tieng-cay-cu-bo-bong-da-nguoi-dang-phai-an-4-the-do-c48a1249291.html',
      content: 'We supply a series of design principles, practical patterns and high quality design resources ' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
    },
    {
      title: 'ant design part',
      description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      date: '',
      originalUrl: 'https://www.24h.com.vn/bong-da/psg-thua-man-city-mang-tieng-cay-cu-bo-bong-da-nguoi-dang-phai-an-4-the-do-c48a1249291.html',
      content: 'We supply a series of design principles, practical patterns and high quality design resources ' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
