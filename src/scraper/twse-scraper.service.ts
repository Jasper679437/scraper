import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as debug from 'debug';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { url } from 'inspector';

@Injectable()
export class TwseScraperService implements OnApplicationBootstrap {
    constructor(private httpService: HttpService) {}

    async onApplicationBootstrap() {
        const tse = await this.FetchStockList({market:'TSE'});
        console.log(tse);
    }

    async FetchStockList (options?: {market: 'TSE'|'OTC'}) {
        const url = options?.market === 'OTC'
        ? 'https://isin.twse.com.tw/isin/class_main.jsp?market=2&issuetype=4' : 'https://isin.twse.com.tw/isin/class_main.jsp?market=1&issuetype=1';
        
        //get html convert big-5
        const page = await firstValueFrom(this.httpService.get(url, {responseType: 'arraybuffer'})).then(response => iconv.decode(response.data, 'big5'));
        debug(page);

        //use cheerio load html to get table
        const $ = cheerio.load(page);

        const rows = $('.h4 tr');

        //each table rows convert data strusture

        const data = rows.slice(1).map((i, el) =>{
            const td = $(el).find('td');
            return{
                symbol: td.eq(2).text().trim(),   // 股票代碼
                name: td.eq(3).text().trim(),     // 股票名稱
                market: td.eq(4).text().trim(),   // 市場別
                industry: td.eq(6).text().trim(), // 產業別
            };
        }).toArray();

        return data; 
    }
}


