import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouchdbService {

  
  // post  - INSERT
  // get   - RETRIEVE
  //delete - DELETE
  //update - PUT
  readonly baseURL='https://192.168.57.185:5984/cred-demo';
  readonly userName= 'd_couchdb';
  readonly password= 'Welcome#2';

  constructor(private http:HttpClient) { }

  private headers=new HttpHeaders({
    'Authorization':' Basic '+btoa(this.userName+':'+this.password),
    'Content-Type':'application/json'
  });

  addUsers(data:any){
    const url=`${this.baseURL}`;
    return this.http.post<any>(url,data,{headers:this.headers})
  }

  getUsers():Observable<any>{
    const url=`${this.baseURL}/_all_docs?include_docs=true`;
    return this.http.get<any>(url,{headers:this.headers});
  }

  deleteUser(userId:string,rev:string):Observable<any>{
    const url=`${this.baseURL}/${userId}?rev=${rev}`;
    return this.http.delete<any>(url,{headers:this.headers})
  }

  updateUser(data:any):Observable<any>{
    const url=`${this.baseURL}/${data._id}`;
    return this.http.put<any>(url,data,{headers:this.headers});
  }
 
  
  private apiUrl = 'http://localhost:3000';  // Adjust the URL to your backend's URL if different

  createUserViaNode(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, userData);
  }
}
