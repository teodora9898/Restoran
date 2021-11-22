using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

[Table("Waiter")]
public class Waiter
{
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Name")]
        [MaxLength(255)]
        public string Name { get; set; }

        [Column("LastName")]
        [MaxLength(255)]
        public string LastName { get; set; }

        [Column("JMBG")]
        [StringLengthAttribute(maximumLength:13, MinimumLength =13,ErrorMessage = "Please insert 13 numbers.")]
        public string JMBG { get; set; } 

        [Column("Experience")]
        [Range(0,40)]  
        public int Experience { get; set; }

        [JsonIgnore]
        public Restaurant Restaurant { get; set; }
        public virtual List<Table> Tables { get; set; }


}