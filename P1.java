import java.util.*;

public class P1{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        
        int n = sc.nextInt();
        sc.nextLine();

        String[] arr = new String[n];
        for(int i=0;i<n;i++){
            arr[i] = sc.nextLine();
            System.out.println(maxDiff(arr[i]));
        }
    }

    public static int maxDiff(String s){
        int len = s.length();
        
        if(len<=1){
            return 0;
        }

        char[] org = s.toCharArray();
        char[] shuffled= s.toCharArray();

        Arrays.sort(shuffled);

        for(int i=0;i<len-1;i++){
            if(shuffled[i]== org[i]){
                char temp = shuffled[i];
                shuffled[i]=shuffled[i+1];
                shuffled[i+1] = temp;
            }
        }

        int diff=0;

        for(int i=0;i<len;i++){
            if(org[i]!=shuffled[i]){
                diff++;
            }
        }

        return diff;
    }
}