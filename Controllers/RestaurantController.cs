using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Restoran.Models;

namespace Restoran.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RestoranController : ControllerBase
    {
        public RestoranContext Context {get; set;}

        public RestoranController(RestoranContext context)
        {
            Context = context;
        }

        //radi
        [HttpGet]
        [Route("GetAllRestaurants")]
        public async Task<JsonResult> GetAllRestaurants()
        {
            var restaurants = await Context.Restaurants
                                  .ToListAsync();
            return new JsonResult(restaurants);
        
        }
        

        //radi
        [HttpGet]
        [Route("GetAllTables/{restId}")]
        public async Task<JsonResult> GetAllTables(int restId)
        {
            var rest = await Context.Restaurants.Include(r => r.Tables)
                               .ThenInclude(t=>t.Waiter)                                
                               .FirstOrDefaultAsync(r => r.ID == restId);              

            return new JsonResult( rest.Tables);
        }    

        //radi
        [HttpGet]
        [Route("GetAllWaiters/{restId}")]
        public async Task<JsonResult> GetAllWaiters(int restId)
        {
            var waiters = await Context.Waiters.Include(waiter=>waiter.Restaurant)
                                               .Include(waiter => waiter.Tables)
                                               .Where(waiter => waiter.Restaurant.ID == restId)
                                               .ToListAsync();
            return new JsonResult(waiters);
        }  
        //radi
        [HttpGet]
        [Route("GetTableById/{tableId}")]
        public async Task<JsonResult> GetTableById(int tableId)
        {
            var table = await Context.Tables.FirstOrDefaultAsync(t=>t.ID == tableId);
                                            
            return new JsonResult(table);
        }  
        //radi
        [HttpGet]
        [Route("GetWaiterById/{restId}/{waiterId}")]
        public async Task<JsonResult> GetWaiterById(int restId, int waiterId)
        {
            var waiter = await Context.Waiters.Include(wtr => wtr.Restaurant)
                                              .Include(wtr=>wtr.Tables)
                                              .FirstOrDefaultAsync(wtr => wtr.ID == waiterId
                                            && wtr.Restaurant.ID == restId);
                                            
            return new JsonResult(waiter);
        }  
 


   
        //radi
        [HttpPost]
        [Route("AddWaiter/{restId}")]
        public async Task AddWaiter(int restId, [FromBody] Waiter waiter)
        {
            waiter.Restaurant = Context.Restaurants.Find(restId);
            Context.Waiters.Add(waiter);          
            await Context.SaveChangesAsync();    
        }

        [HttpPost]
        [Route("AddRestaurant")]
        public async Task AddRestaurant([FromBody] Restaurant restaurant)
        {
            Context.Restaurants.Add(restaurant);
            await Context.SaveChangesAsync();    
        }   

         //radi //doslo je do promene
        [HttpDelete]
        [Route("DeleteWaiter/{restId}/{id}")]
        public async Task DeleteWaiter(int restId,int id)
        {
        var waiter = await Context.Waiters.Include(w=>w.Tables)
                                .FirstOrDefaultAsync(w=>w.Restaurant.ID == restId && w.ID==id);
        waiter.Tables.ForEach(t=>{
                t.Waiter=null;
                t.Status=0;
        });

        Context.Remove(waiter);
        await Context.SaveChangesAsync();

        }

    //radi
        [HttpPut]
        [Route("UpdateTableStatus/{tableId}/{status}")]
         public async Task UpdateTableStatus(int tableId, int status)
        {
            
            var table = Context.Tables.Include(t=>t.Waiter)
                        .FirstOrDefault(t=>t.ID == tableId);
            if(table.WaiterId!=null){
                if((((int)table.Status)==(status-1)) ||
                (((int)table.Status == 4) && status == 1))
                {
                table.Status = (Status)status;
                Context.Update<Table>(table);
                await Context.SaveChangesAsync();
             }
             }
            
        }

        [HttpPut]
        [Route("UpdateTableStatusToOne/{tableId}/{status}")]
         public async Task UpdateTableStatusToOne(int tableId, int status)
        {
            
            var table = Context.Tables.Include(t=>t.Waiter)
                        .FirstOrDefault(t=>t.ID == tableId);
            
            if(table.Waiter==null)
            {
                table.Status = (Status)status;
                Context.Update<Table>(table);
                await Context.SaveChangesAsync();
            }

           
        }

        [HttpPut]
        [Route("UpdateTableStatusToZero/{tableId}/{status}")]
         public async Task UpdateTableStatusToZero(int tableId, int status)
        {
            
            var table = Context.Tables.Include(t=>t.Waiter)
                        .FirstOrDefault(t=>t.ID == tableId);
            
           
                table.Status = (Status)0;
                Context.Update<Table>(table);
                await Context.SaveChangesAsync();
        

           
        }

        [HttpPut]
        [Route("AddTableToWaiter/{tableId}/{waiterId}")]
        public async Task<IActionResult> AddTableToWaiter(int tableId, int waiterId)
        {
            var t = Context.Tables.Include(tab => tab.Waiter)
                                  .FirstOrDefault(tab => tab.ID == tableId);
  
           if(t.WaiterId== null)
           {
               var w = Context.Waiters.Find(waiterId);
               t.Waiter = w;
               t.Status=(Status)1;
               Context.Update<Table>(t);
               await Context.SaveChangesAsync();

               return Ok();           
           }
           else
           {
               return BadRequest("This table already has a waiter!");
           }
            
       }

    }
}
