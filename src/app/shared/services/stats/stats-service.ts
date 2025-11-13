import { Injectable } from '@angular/core';
import { IMatch } from '../../types/imatch';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  matches:IMatch[]=[
    {
      winer: "User1",
      date: new(Date),
      game: "snake",
      details: "user1(100pts), user2(50pts)"
    },
    {
      winer: "User2",
      date: new(Date),
      game: "snake",
      details: "user1(10pts), user2(50pts)"
    },
    {
      winer: "User1",
      date: new(Date),
      game: "conecta4",
      details: "user1(200pts), user2(10pts)"
    },
    {
      winer: "User1",
      date: new(Date),
      game: "conecta4",
      details: "user1(200pts), user2(10pts)"
    },
    {
      winer: "User1",
      date: new(Date),
      game: "conecta4",
      details: "user1(200pts), user2(10pts)"
    }
  ]

  getStats():IMatch[]{
    return this.matches
  }
}
