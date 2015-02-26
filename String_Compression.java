package New;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPOutputStream;
import java.util.zip.*;

public class String_Compression {

	public static void main(String[] args) throws IOException {
		String output = "222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222000000000010001000000000000001100000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
		
		System.out.println("after compress:");
	    System.out.println(compress(output));

	}
	
	public static String compress(String str) throws IOException {
	    if (str == null || str.length() == 0) {
	        return str;
	    }
	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    GZIPOutputStream gzip = new GZIPOutputStream(out);
	    gzip.write(str.getBytes());
	    gzip.close();
	    return out.toString("ISO-8859-1");
	 }

}
