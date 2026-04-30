https://app.coderpad.io/Z7TY92XG

- first question is recover original array given diff array
    - create diff array and recover original
- basically prefix sum array you can get  
- boundary mark gives start [l] end +update at beginning of 
  range -update [r+1] at end of range
- one update with boundary mark
- 2 problems -> 1 with 1D, 1 with 2D 
- running total for diff array

# 2D
- prefix sum is 2x2 block
diff[i][j] = a[i][j]
           - a[i-1][j]
           - a[i][j-1]
           + a[i-1][j-1]
- prefix sum sum whole block from index[0][0]
- 2x2 block
    + above + left - top left diagonal
- reverse = prefix sum, diff array
//differece
//-above-left+diagonal

//prefix
//+above+left-diagonal


// diff array
int[][] diff = new int[A.length-1][A[0].length-1];
for (int r=0; r<diff.length; r++) {
    for (int c=0; c<diff[0].length, c++) {
      if (r==0 && c==0) {  //0 0
        diff[r][c]=A[r][c];
      } else if (r==0) {  //row 0  minus left
        diff[r][c]=A[r][c]-A[r][c-1];
      } else if (c==0) {  //col 0  minus above
        diff[r][c] = A[r][c]-A[r-1][c];  
      } else {
        diff[r][c] = A[r][c] - 
         - A[r-1][c]
         - A[r][c-1]
         + A[r-1][c-1];
      }
    }
}         

System.out.println("difference array");
for (int r=0; r<diff.length; r++) {
  for (int c=0; c<diff[0].length; c++) {
      System.out.print(diff[r][c]+" ");
  }
  System.out.println();
}


import java.io.*;
import java.util.*;

class Solution {
  public static void main(String[] args) {
         
         int[][] A = {{1,2,3,4},
                      {5,6,7,8},
                      {9,10,11,12},
                      {13,14,15,16}};

          //differece
          //-above-left+diagonal
          
          //prefix
          //+above+left-diagonal
           System.out.println("original array");
          for (int r=0; r<A.length; r++) {
            for (int c=0; c<A[0].length; c++) {
                System.out.print(A[r][c]+" ");
            }
            System.out.println();
          }

          int[][] diff = new int[A.length][A[0].length];
          for (int r=0; r<diff.length; r++) {
              for (int c=0; c<diff[0].length; c++) {
                if (r==0 && c==0) {  //0 0
                  diff[r][c]=A[r][c];
                } else if (r==0) {  //row 0  minus left
                  diff[r][c]=A[r][c]-A[r][c-1];
                } else if (c==0) {  //col 0  minus above
                  diff[r][c] = A[r][c]-A[r-1][c];  
                } else {
                  diff[r][c] = A[r][c]  
                   - A[r-1][c]
                   - A[r][c-1]
                   + A[r-1][c-1];
                }
              }
          }

          System.out.println("difference array");
          for (int r=0; r<diff.length; r++) {
            for (int c=0; c<diff[0].length; c++) {
                System.out.print(diff[r][c]+" ");
            }
            System.out.println();
          }
           

          int[][] prefix = new int[A.length][A[0].length];
          for (int r=0; r<prefix.length; r++) {
              for (int c=0; c<prefix[0].length; c++) {
                if (r==0 && c==0) {  //0 0
                  prefix[r][c]=diff[r][c];
                } else if (r==0) {  //row 0  minus left
                  prefix[r][c]= diff[r][c]+prefix[r][c-1];
                } else if (c==0) {  //col 0  minus above
                  prefix[r][c] = diff[r][c]+prefix[r-1][c];  
                } else {
                  prefix[r][c] = diff[r][c] 
                   + prefix[r-1][c]
                   + prefix[r][c-1]
                   - prefix[r-1][c-1];
                }
              }
          }
          System.out.println("prefix array");
          for (int r=0; r<prefix.length; r++) {
            for (int c=0; c<prefix[0].length; c++) {
                System.out.print(prefix[r][c]+" ");
            }
            System.out.println();
          }

  
  }
}

- 1 line sweep problem (1/2D array)
- Segment tree

# Line Sweep
https://www.youtube.com/watch?v=-FxkJiCyg5g&list=PLpIkg8OmuX-IOG_-Bv92l-EhuBQX28LOm
