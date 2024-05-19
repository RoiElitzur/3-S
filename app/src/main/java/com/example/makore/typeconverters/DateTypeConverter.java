package com.example.makore.typeconverters;
import java.util.Date;
import androidx.room.TypeConverter;

public class DateTypeConverter {
    @TypeConverter
    public static Date toDate(Long value) {
        return value == null ? null : new Date(value);
    }

    @TypeConverter
    public static Long fromDate(Date date) {
        return date == null ? null : date.getTime();
    }

}
