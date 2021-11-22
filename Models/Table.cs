using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

//mozda da vrednosti enuma budu boje?
public enum Status
{
    EmptyWithNoWaiter,
    EmptyWithWaiter,
    GuestsSeated,
    GuestsOrdered,
    GuestsServerd
}

public class Table
{
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Number")]
        [Range(1,50)]
        public int Number { get; set; }

        [Column("NumberOfSeats")]
        [Range(2,10)]
        public int NumberOfSeats { get; set; }

        [Column("Status")]
       // [EnumDataType(typeof(Status))]
        public Status Status { get; set; }

        [JsonIgnore]
        public Waiter Waiter { get; set; }
        
        [Column("WaiterId")]
        public int? WaiterId {get; set;}

        

}