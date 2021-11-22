using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Restaurant
{
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Name")]
        [MaxLength(255)]
        [Required(ErrorMessage ="Please add name")]
        public string Name { get; set; }

        [Column("Address")]
        [MaxLength(255)]
        public string Address { get; set; }

        public virtual List<Waiter> Waiters { get; set; }
        public virtual List<Table> Tables { get; set; }
        

}